Overview
========

Swearch is a web app for accessing search engines quickly. It was built for the iPhone, though it'll move to other platforms soon. It's based on open web technologies like HTML, CSS, and JavaScript. It's powered by jQuery and uses a few classes to do the heavy lifting.

The source is intended for the following people:

* people who want to self-host their app
* people who are privacy-conscious
* people who want to add extra search engines
* people who want to build their own iPhone web app

Install
=======

To install:

* cd into a directory accessible by your webserver
* git clone <repo URL>

That's it! If you want to use the HTML5 offline application cache, there are a couple more steps.

* if you don't have node.js installed, you'll need to either install that or port the script
* node build-manifest.js - this will build the HTML5 app manifest
* if your server is not configured to send the correct content type, it must return `Content-Type: text/cache-manifest` for .manifest files (note: if you're using Apache and it can use .htaccess files, then the .htaccess file included in the repository will make that happen)

License
=======

Copyright (c) 2010, Steve Streza
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the <ORGANIZATION> nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE