<div class="card">
    <div class="ui header">
        <a href="#install" id="install">#</a> Installing <u>Six</u>
    </div>

**Step 1**
Clone the git repo

```bash
$ git clone 
```
(cd into your cloned repo!)

**Step 2**
Run npm init

```bash
$ npm init
```

**Step 3**
Set configurations

```bash
$ vim config.json
```
(or, open in your favorite code editor)

```js
{
    // leave this as is
    "themeLookup": "themes/",
    // this is the folder you want your built site to live in
    // MUST BE an absolute path
    "outputPath": "/Users/johnsmith/Desktop/landingPagePrototype",
    // you may look in the themes/ directory to find supported themes
    // or, make your own!
    "theme": "classic"
}
```

**Step 4**
Run your watcher

```bash
$ node press -d themes/classic/data/
```
(or, whichever theme you chose in config)

At this point, if you point your browser to index.html in whatever you set your **outputPath** to, you should see one of the three themes displayed above.

**Step 5**
Add your data
Add your data

```bash
cd themes/classic/data
vim aboutMe.md
```
(or, open in your favorite code editor)

**Step 6**
Make a change!

You will notice a notification (if you are on a mac) once the changes have been processed. If you open up the outputPath you specified in your config.json in a browser, you should see your built webpage!

</div>
