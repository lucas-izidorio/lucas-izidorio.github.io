$(function() {
    let imagesEndpoint = "https://image.tmdb.org/t/p/w500";
    let endpoint = "https://api.themoviedb.org/3/";
    let apiKey = "c89f82329cbe5297b30fc51aa8c0035c";

    let filmesLancamentos = [{
        trailer: "trailerLancamento1",
        titulo: "tituloLancamento1",
        sinopse: "sinopseLancamento1",
        direcao: "direcaoLancamento1",
        roteiro: "roteiroLancamento1",
        estreia: "estreiaLancamento1",
        elenco: "elencoLancamento1",
        avaliacao: "avaliacaoLancamento1",
    }]

    let filmesDestaque = [{
            titulo: "tituloFilme1",
            link: "linkFilme1",
            poster: "posterFilme1"
        },
        {
            titulo: "tituloFilme2",
            link: "linkFilme2",
            poster: "posterFilme2"
        },
        {
            titulo: "tituloFilme3",
            link: "linkFilme3",
            poster: "posterFilme3"
        },
        {
            titulo: "tituloFilme4",
            link: "linkFilme4",
            poster: "posterFilme4"
        }
    ]

    $("#carregarFilmesButton").on("click", loadMovies);

    $("#search-site").on('keyup', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            window.open("https://www.themoviedb.org/search/movie?query=" + $("#search-site").val());
        }
    });

    carregarLancamentos();
    carregarFilmesDestaque();

    function definirHtml(id, valor) {
        $("#" + id).html(valor);
    }

    function definirAvaliacao(avaliacao, filmeLancamento) {
        let estrelas = avaliacao / 2;

        let spl = estrelas.toString().split('.');

        let estrelasTotais = parseInt(spl[0]);
        let estrelasMedias = parseInt(spl[1]) >= 5 ? 1 : 0;
        let estrelasVazias = 5 - (estrelasTotais + estrelasMedias);

        let codigo = '';
        for (let i = 0; i < estrelasTotais; i++) {
            codigo += '<span class="fas fa-star text-dark">'
        }
        for (let i = 0; i < estrelasMedias; i++) {
            codigo += '<span class="fas fa-star-half-alt text-dark">'
        }
        for (let i = 0; i < estrelasVazias; i++) {
            codigo += '<span class="far fa-star text-dark">'
        }

        definirHtml(filmeLancamento.avaliacao, codigo);
    }

    function carregarTrailer(id, filmeLancamento) {
        let urlRequest = endpoint + "movie/" + id + "/videos" + "?api_key=" + apiKey + "&language=en-US";
        $.ajax({
            url: urlRequest,
            type: 'GET',
            success: function(res) {
                for (let i = 0; i < 1; i++) {
                    $("#" + filmeLancamento.trailer).attr("src", "https://www.youtube.com/embed/" + res["results"][i]["key"]);
                }
            }
        });
    }

    function carregarMaisInfo(id, filmeLancamento) {
        console.log("teste" + id);
        let urlRequest = endpoint + "movie/" + id + "/credits" + "?api_key=" + apiKey + "&language=en-US";
        console.log(urlRequest);
        $.ajax({
            url: urlRequest,
            type: 'GET',
            success: function(res) {
                let diretores = "";
                let roteiristas = "";
                let elenco = "";

                for (let i = 0; i < res["crew"].length; i++) {
                    let crewMember = res["crew"][i];
                    if (crewMember["job"] == "Director") {
                        diretores += crewMember["name"] + ", ";
                    }
                    if (crewMember["job"] == "Story" && roteiristas == "") {
                        roteiristas += crewMember["name"] + ", ";
                    }
                }

                diretores = diretores.substring(0, diretores.length - 2);
                roteiristas = roteiristas.substring(0, roteiristas.length - 2);

                for (let i = 0; i < 3; i++) {
                    let castMember = res["cast"][i];
                    elenco += castMember["name"] + ", ";
                }

                elenco = elenco.substring(0, elenco.length - 2);

                console.log(filmeLancamento.elenco, elenco);

                definirHtml(filmeLancamento.direcao, diretores);
                definirHtml(filmeLancamento.roteiro, roteiristas);
                definirHtml(filmeLancamento.elenco, elenco);
            }
        });
    }

    function carregarLancamentos() {
        let urlRequest = endpoint + "movie/now_playing" + "?api_key=" + apiKey + "&language=pt-BR";
        $.ajax({
            url: urlRequest,
            type: 'GET',
            success: function(res) {
                for (let i = 0; i < 1; i++) {
                    console.log(res["results"][i]["id"]);
                    carregarTrailer(res["results"][i]["id"], filmesLancamentos[i]);
                    definirHtml(filmesLancamentos[i].titulo, res["results"][i]["title"]);
                    definirHtml(filmesLancamentos[i].sinopse, res["results"][i]["overview"])

                    let data = new Date(res["results"][i]["release_date"] + "T00:00");
                    let dataFormatada = data.getDate() + "/" + data.getMonth() + "/" + data.getFullYear();
                    definirHtml(filmesLancamentos[i].estreia, dataFormatada);

                    definirAvaliacao(res["results"][i]["vote_average"], filmesLancamentos[i]);
                    carregarMaisInfo(res["results"][i]["id"], filmesLancamentos[i]);
                }
                console.log(res);
            }
        });
    }

    function carregarFilmesDestaque() {
        let urlRequest = endpoint + "movie/popular" + "?api_key=" + apiKey + "&language=pt-BR";
        $.ajax({
            url: urlRequest,
            type: 'GET',
            success: function(res) {
                for (let i = 0; i < 4; i++) {
                    $("#" + filmesDestaque[i].link).attr("href", "https://www.themoviedb.org/movie/" + res["results"][i]["id"]);

                    definirHtml(filmesDestaque[i].titulo, res["results"][i]["original_title"]);
                    carregarImagem(filmesDestaque[i].poster, res["results"][i]["poster_path"]);
                }
            }
        });
    }

    function carregarImagem(id, imagePath) {
        $("#" + id).attr("src", imagesEndpoint + imagePath);
    }

    function loadMovies() {
        let urlRequest = endpoint + "movie/popular" + "?api_key=" + apiKey + "&language=pt-BR";
        //$("#teste").html("This is Hello World by JQuery" + url);
        console.log("start");
        $.ajax({
            url: urlRequest,
            type: 'GET',
            success: function(res) {
                console.log(res);
                alert(res);
            }
        });
    }














































});