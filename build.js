var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var marked = require("marked");
var yaml = require("js-yaml");
var shell = require("shelljs");
var minifyHtml = require("html-minifier").minify;


var postTemplatePath = path.join(__dirname, "ejs", "_post-template.html.ejs");
var postTemplateData = fs.readFileSync(postTemplatePath, 'utf-8');

function post(filename) {
    var postPath = path.join(__dirname, "posts", filename + ".md");
    var postData = fs.readFileSync(postPath, 'utf-8');
    var postDataSplitted = postData.split("---");

    var frontmatter = yaml.load(postDataSplitted[0]);
    var html = marked(postDataSplitted[1]);

    return ejs.render(
        postTemplateData,
        {
            "title": frontmatter["title"],
            "date": frontmatter["date"],
            "delete_date": frontmatter["delete_date"],
            "contents": html,
        }
    );
};


var indexPath = path.join(__dirname, "ejs", "index.html.ejs");
var indexData = fs.readFileSync(indexPath, 'utf-8');
var indexRendered = ejs.render(indexData, { post: post });
var indexMinified = minifyHtml(indexRendered, { collapseWhitespace: true, removeComments: true});

shell.mkdir("-p", path.join(__dirname, "dest"));
shell.cp("-R", path.join(__dirname, "static/*"), path.join(__dirname, "dest/"));
fs.writeFileSync(path.join(__dirname, "dest", "index.html"), indexMinified);