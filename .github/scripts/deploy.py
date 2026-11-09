"""Upload application files without deleting any existing hosting content."""
from pathlib import Path, PurePosixPath
import ftplib
import os
import ssl
import sys

ROOT = Path(__file__).resolve().parents[2]


def upload_plan(root=ROOT):
    files = []
    # Flatten public/ into the domain root, retaining src/ alongside it.
    for folder, prefix in [('public', ''), ('src', 'src')]:
        source = root / folder
        for local in sorted(source.rglob('*')):
            if local.is_symlink():
                raise ValueError('Deployment does not accept symbolic links.')
            if local.is_file():
                relative = local.relative_to(source)
                if any(part.startswith('.') for part in relative.parts):
                    continue
                remote = PurePosixPath(prefix) / PurePosixPath(relative.as_posix())
                files.append((local, remote))
    if not files or not (root / 'public/index.php').is_file():
        raise ValueError('Website entry point is missing.')
    return files


def deploy(files, server, username, password, directory):
    # TLS is required for both credentials and file transfers. Never fall back to FTP.
    with ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=45) as ftp:
        ftp.connect(server, 21)
        ftp.login(username, password)
        ftp.prot_p()
        ftp.set_pasv(True)
        ftp.cwd(directory)
        base = ftp.pwd()
        for local, remote in files:
            ftp.cwd(base)
            for part in remote.parent.parts:
                try:
                    ftp.cwd(part)
                except ftplib.error_perm:
                    ftp.mkd(part)
                    ftp.cwd(part)
            with local.open('rb') as stream:
                ftp.storbinary('STOR ' + remote.name, stream)
            print('Uploaded ' + str(remote), flush=True)
    print('Deployment completed. Existing unrelated files were preserved.')


def main():
    files = upload_plan()
    if '--dry-run' in sys.argv:
        for _, remote in files:
            print(remote)
        return
    required = ['FTP_SERVER', 'FTP_USERNAME', 'FTP_PASSWORD']
    missing = [name for name in required if not os.environ.get(name)]
    if missing:
        raise ValueError('Missing GitHub repository secrets: ' + ', '.join(missing))
    server = os.environ['FTP_SERVER'].strip()
    if not server or any(c in server for c in '/\\\r\n:'):
        raise ValueError('FTP_SERVER must contain only a hostname, without a URL or port.')
    directory = os.environ.get('FTP_DIRECTORY', '/htdocs').strip()
    if not directory.startswith('/') or '..' in PurePosixPath(directory).parts or '\n' in directory or '\r' in directory:
        raise ValueError('FTP_DIRECTORY must be an absolute hosting path without parent traversal.')
    deploy(files, server, os.environ['FTP_USERNAME'], os.environ['FTP_PASSWORD'], directory)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, ftplib.Error) as error:
        # Avoid logging server responses, which may contain account details.
        if isinstance(error, ValueError):
            print(str(error), file=sys.stderr)
        else:
            print('Deployment failed (' + type(error).__name__ + '). Check hosting FTP availability, credentials, directory and TLS support. No insecure fallback was attempted.', file=sys.stderr)
        sys.exit(1)
