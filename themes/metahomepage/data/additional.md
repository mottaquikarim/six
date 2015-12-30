<div class="card">
    <div class="ui header">
        <a href="#tricks" id="tricks">#</a> Additional notes + tricks
    </div>

**You can run the built command without a watch**

Just do the following:
```bash
$ node app/index.js
```

Note that:
```bash
$ node app/index.js -h

    Usage: index [options]

    Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -t, --theme [themename]  choose a theme [default]
    -o, --output [output]    choose output path [output]

```

You may specify theme name and output path via commandline -- however, config.json values for theme and output path will **always** override command line args.

For example:
```bash
$ node app/index.js -o /Users/johnsmith/Desktop/output
```

will output your build files to a folder in the Desktop using the default theme.

And:
```bash
$ node app/index.js -o /Users/johnsmith/Desktop/output -t classic
```

will do the same as above but classic theme will be used

**Adding additional data with theme/THEMENAME/config.json**

Each theme folder has three important parts:

1. **static** folder containing html/css/js for output site
2. **data** folder containing markdown and text files to be built
3. **config.json** specific to that theme that specifies names that <u>Six</u> can use to identify which information block goes where.

You can modify the theme config.json at any time or create your own theme by copying an existing theme.

A typical theme's config.json looks like this:

```js
{
    // you can ignore this, unless you want to rename your thereme's static directory
    "staticBase": "static/",
    // determines which files need to be built
    "data": {
        // specifies data inputs for index.html
        "index.html": {
            // the "title" key will be used in index.html to tell Six to input data from data/title.txt into the right area
            "title": "data/title.txt",
            "backgroundImage": "data/backgroundImage.txt",
            "intro": "data/intro.md",
            "installation": "data/installation.md",
            "additional": "data/additional.md",
            "footer": "data/footer.md"
        }
        // you can add additional HTML files and data inputs by copying the index.html block and changing names
    }
}
```

if we were to open up this theme's index.html, it might look something like this:
```html
<!doctype html>
<html>
<head>
	<meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0;'>
    <title><%= title %></title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800" rel="stylesheet" type="text/css">
    <link rel='stylesheet' href='styles/semantic.min.css'>
    <link rel='stylesheet' href='styles/main.css'>
</head>
<body>
    <section class="col glbl--mobile-block">
        <section class="col__full glbl--mobile-full infoCol">
            <header style="background-image: url('<%= backgroundImage %>');">
                <div class="profile-pic">
                    <img class="ui small circular image image--center" src="<%= profileImage %>"> 
                </div>
                <h1 class="supermassive supermassive--light supermassive--center"><%= name %></h1>
            </header>
            <main class="main-info">
                <%= aboutMe %>
            </main>
            <%= footer %>
        </section>
     </section>
    <script src='http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'></script>
    <script src='javascript/semantic.min.js'></script>
    <script src='javascript/main.js'></script>
</body>
</html>
```

See this block on the 6th line?
```html
<title><%= title %></title>
```

The "title" corresponds to the "title" key we saw in the config.json above (reproduce below for your convenience):

```js
{
    // you can ignore this, unless you want to rename your thereme's static directory
    "staticBase": "static/",
    // determines which files need to be built
    "data": {
        // specifies data inputs for index.html
        "index.html": {
            // the "title" key will be used in index.html to tell Six to input data from data/title.txt into the right area
            "title": "data/title.txt",
            "backgroundImage": "data/backgroundImage.txt",
            "intro": "data/intro.md",
            "installation": "data/installation.md",
            "additional": "data/additional.md",
            "footer": "data/footer.md"
        }
        // you can add additional HTML files and data inputs by copying the index.html block and changing names
    }
}
```

You can add as many of these keys as you want to your index.html. As long as there is a one to one relationship between keys you put in the real index.html and the "index.html" key in config.json.G

Also note best practice if you want to add or remove data fields from a theme is to just copy the folder, rename the theme, and go from there.

And finally, note that we are using underscorejs's templating system. More info **[here](http://underscorejs.org/#template)**

</div>
