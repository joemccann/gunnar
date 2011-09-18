# /bin/bash
# Titanium Copy and Build Script
# usage: bash_script_name directory_of_code directory_for_building app_name app_version
# usage:  ./ti_build.sh gunnar_app gunnar_build Gunnar 0.0.1

ESC_SEQ='\x1b['
COL_RESET=$ESC_SEQ'39;49;00m'
COL_RED=$ESC_SEQ'31;01m'
COL_GREEN=$ESC_SEQ'32;01m'
COL_YELLOW=$ESC_SEQ'33;01m'
COL_BLUE=$ESC_SEQ'34;01m'
COL_MAGENTA=$ESC_SEQ'35;01m'
COL_CYAN=$ESC_SEQ'36;01m'

rm -rf ../$2/*
echo $COL_RED"\nRemoving files in $2.\n"
cp -r ../$1/ ../$2/
echo $COL_BLUE"\nCopying $1 to $2\n"
rm -rf ../$2/Resources
echo $COL_RED"\nRemoving Resources symlink.\n"
mkdir ../$2/Resources
echo $COL_BLUE"\nCreating new Resources directory.\n"
cp -r ../public/ ../$2/Resources/
echo $COL_BLUE"\nCopied static files from Public to Resources.\n"
rm -rf ../dist/*.app ../dist/*.zip
echo $COL_RED"\nRemoved old app and/or zip files in dist directory.\n"
echo $COL_YELLOW
/Library/Application\ Support/Titanium/sdk/osx/1.2.0/tibuild.py -d ../dist -n -t bundle \
-a /Library/Application\ Support/Titanium/sdk/osx/1.2.0/ ~/Documents/workspace/gunnar/$2

echo $COL_GREEN"\nBundles Titanium App now resides in dist directory.\n"
echo $3_v_$4.zip ../dist/*.app

cd ../dist
zip -r --quiet $3_v_$4.zip *.app
cd ..

echo $COL_GREEN"\nZip file created.\n"
