off-brand-vine
==================

A process that takes videos (and images) from a Twitter account and puts it into a GitHub repo (from which you can make a web page that displays them).

Installation
------------

    npm install off-brand-vine

Usage
-----

First, fork this repo.

Then, create a config.js file (TODO)

And a config.mk file like this:

    PROJECTNAME = <your project name, no spaces>
    USER = <the user that the service will run as>
    PRIVUSER = <a user that can sudo to install a service>
    SERVER = <server or IP address>

TODO: how to edit off-brand-vine.service. Explain need for local private key so `ssh` targets work.

    make initial-setup
    make check-status


Tests
-----

Run tests with `make test`.

License
-------

The MIT License (MIT)

Copyright (c) 2017 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
