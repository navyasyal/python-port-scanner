"""
utils.py

Shared helper functions for target validation and service name resolution.
Reused and lightly hardened from the original CLI scanner.
"""

import ipaddress
import socket


def validate_target(target: str) -> bool:
    """
    Checks whether the target is a valid IP address or a resolvable hostname.
    """
    if not target or not isinstance(target, str):
        return False

    target = target.strip()

    try:
        ipaddress.ip_address(target)
        return True
    except ValueError:
        try:
            socket.gethostbyname(target)
            return True
        except socket.gaierror:
            return False


def resolve_target(target: str) -> str:
    """
    Resolves a hostname to its IP address. Returns the original target
    if it is already an IP address or resolution fails.
    """
    try:
        ipaddress.ip_address(target)
        return target
    except ValueError:
        try:
            return socket.gethostbyname(target)
        except socket.gaierror:
            return target


def get_service(port: int) -> str:
    """
    Resolves the common service name for a given port number.
    """
    try:
        return socket.getservbyport(port)
    except OSError:
        return "Unknown"


def categorize_port(port: int) -> str:
    """
    Buckets a port number into a human-readable category, used for the
    'Port Categories' chart on the dashboard.
    """
    if port < 1024:
        return "Well-Known (0-1023)"
    elif port < 49152:
        return "Registered (1024-49151)"
    else:
        return "Dynamic/Private (49152-65535)"
