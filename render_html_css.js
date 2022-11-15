var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var url = require("url");

function css(request, response) {
    if (request.url === "/style.css") {
        response.writeHead(200, {"Content-Type": "text/css"});
        var fileContents = fs.readFileSync("./style.css", {encoding: "utf-8"});
        response.write(fileContents);
        response.end();
    }
}

var renderHome = fs.readFileSync("./pages/home.html")
var renderCourses = fs.readFileSync("./pages/courses.html")
var renderLogin = fs.readFileSync("./pages/login_form.html")
var renderProfil = fs.readFileSync("./pages/profil.html")
var renderDaftar = fs.readFileSync("./pages/pendaftaran.html")

var server = http.createServer(function (request, response) {
    css(request, response);
    response.writeHead(200, {"Content-Type": "text/html"});
    if (request.url == '/'){
        response.write(renderHome);
    } else if (request.url == '/courses'){
        response.write(renderCourses);
    } else if (request.url == '/login_form'){
        response.write(renderLogin);
    } else if (request.url == '/pendaftaran') {
        response.write(renderDaftar);
    }
    else if (request.url === "/login" && request.method === "GET") {
        fs.readFile("login_form.html", (error, data) => {
            if(error) {
                response.writeHead(404, {"Content-Type": "text/html"});
                return response.end("404 Not found");
            }
            else {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data);
                return response.end();
            }
        });
    }
    else if (request.url === "/login" && request.method === "POST") {
        var requestBody = "";
        request.on("data", function (data) {
            requestBody += data;
        });

        request.on("end", function () {
            var formData = qs.parse(requestBody);

            if (formData.username === "gilang" && formData.password === "123") {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(renderProfil);
                response.end();
            }
        });
    }
    var q = url.parse(request.url, true);
    if (q.pathname == "/cari" && request.method == "GET") {
        var keyword = q.query.keyword;
        if (keyword) {
            response.writeHead(200, {"Content-Type" : "text/html" });
            response.write("<h2>Pencarian</h2>");
            response.write("<p>Anda Mencari: <b>" +keyword + "</b></p>");
            response.write("<h3><b>Tidak Ada Hasil ! Maaf Website ini masih dalam tahap pengembangan</h3></b>");
            response.end("<a href='/'>Kembali</a>");
        }   else {
            fs.readFile("cari.html", function (error, data) {
                if (error) {
                    response.writeHead(404, { "Content-Type" : "text/html"});
                    response.end("404 Not Found");
                }
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data);
                response.end();
            });
        }
    }
    
});

server.listen(process.env.PORT||5000);
console.log("Server Berjalan Lancar")