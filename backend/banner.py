"""
banner.py

Grabs a service banner from an open TCP port. Reused from the original
CLI scanner, with a small HTTP HEAD probe kept for port 80/443/8080 style
web ports so the banner field isn't blank for the most common service.
"""

import socket

HTTP_LIKE_PORTS = {80, 8080, 8000, 8888}


def grab_banner(ip: str, port: int, timeout: float = 2.0) -> str:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        sock.connect((ip, port))

        if port in HTTP_LIKE_PORTS:
            sock.send(b"HEAD / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n")

        banner = sock.recv(1024)
        sock.close()

        decoded = banner.decode(errors="ignore").strip()
        return decoded if decoded else "No Banner"

    except Exception:
        return "No Banner"
