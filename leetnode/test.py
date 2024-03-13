import collections.abc

if hasattr(collections.abc, 'MutableMapping'):
    print("MutableMapping exists in this Python version.")
else:
    print("MutableMapping does not exist in this Python version.")


