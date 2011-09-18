Build for the Mac App Store:
===========================

The following is how to build for the Mac App store and assumes you already have your necessary certificates sorted out.  

For more info, [see here](http://wiki.appcelerator.org/display/guides/Submitting+App+to+Mac+App+Store)

LOCAL/PROJECT DIRECTORY
----------------------------

<p>Run this from the build directory (~/Documents/workspace/gunnar/build)</p>

First, remove old files/directories, remake them and run the standard desktop build script.
<pre>
rm -rf ../dist && mkdir ../dist && mkdir ../dist/mac && ./ti_build.sh gunnar_app gunnar_build Gunnar 0.0.1
</pre>

Verify that the app works.
<pre>open ../dist/Gunnar.app</pre>

For me it works fine. Authentication and drag/drop a file then upload with no problems.

<p>
Now:
</p>

<pre>
/Library/Application\ Support/Titanium/sdk/osx/1.2.0/tibuild.py --appstore -d ../dist/mac ~/Documents/workspace/gunnar/gunnar_build
</pre>

Verify that the app works.
<pre>open ../dist/mac/Gunnar.app</pre>

Next, we need to modify the Plist file with the proper Category type of the application.

Note:  This doesn't work??? ->

<pre>
defaults write ../dist/mac/Gunnar.app/Contents/Info LSApplicationCategoryType public.app-category.utilities
</pre>

Since the above doesn't work/has a bug, we manually edit the Plist file like so:
<pre>
vim ../dist/mac/Gunnar.app/Contents/Info.plist
</pre>

And copy paste this in the root &lt;dict&gt; node:
<pre>
&lt;key&gt;LSApplicationCategoryType&lt;/key&gt;
&lt;string&gt;public.app-category.utilities&lt;/string&gt;
</pre>

Permission issues persist, so we need to do this:
<pre>
chmod -R 755 ../dist/mac/Gunnar.app
</pre>

Next, let's sign our app:
<pre>
codesign -f -v -s "3rd Party Mac Developer Application: Joe McCann" ../dist/mac/Gunnar.app
</pre>

Now, build the .pkg:
<pre>
productbuild \
    --component ../dist/mac/Gunnar.app /Applications \
    --sign "3rd Party Mac Developer Installer: Joe McCann" \
    --product ../dist/mac/Gunnar.app/Contents/Info.plist ../dist/mac/Gunnar.pkg
</pre>

Make sure you
<pre>
sudo find / -name Gunnar.app | xargs rm -rf
</pre>
to remove any installations of the app.  Note:  This may take a while depending on your machine.
If you are confident you only have your app installed in your local directory, change the path from "/", "/path/to/your/app" in the <code>find</code> command.

Finally, test the installation.
<pre>
sudo installer -store -pkg ../dist/mac/Gunnar.pkg -target / 
</pre>

This should install the app in the <code>/Applications</code> directory.

Verify your installation and make sure your app works:
<pre>
open /Applications/Gunnar.app
</pre>

Now, launch the Application Loader to upload to the Mac App store (you will need to have done all the work on the Mac App store webapp first)

<pre>
open /Developer/Applications/Utilities/Application\ Loader.app
</pre>