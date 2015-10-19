var QueryString = function() {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], pair[1]];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
}();

var loadpage = (function() {

  var store;
  var nodemap = [];
  var linhas = [],
    colunas = [],
    data = [],
    pontos = [];

  
  var contaPacotes = 0;

  //variaveis utilizadas
  
  var totalTweets;
  var minRetweets = 0;
  var maxRetweets = 5000000;
  
  var indice = {};
  var indicedescritor = {};
  var varglobal = {};
  var maximosPorDescritor = {};
  var lido = {};
  var dados = [];
  var lista = [];
  var contas = [];
  var semanas = [];
  var margin = 20,
    diameter = 640;

  var tweetslistados = {};
  var urlDesc = urlDefault + ':' + urlDefaultPort + "/desc/query";
  var urlTotal = urlDefault + ':' + urlDefaultPort + "/tweets/total";
  var urlTemas = urlDefault + ':' + urlDefaultPort + '/temas/query';
  var urlSubtemas = urlDefault + ':' + urlDefaultPort + "/tags/query";
  var urlIniciativas = urlDefault + ':' + urlDefaultPort + "/iniciativa/query";
  var urlFases = urlDefault + ':' + urlDefaultPort + "/fase/query";
  var urlBibliografia = urlDefault + ':' + urlDefaultPort + "/bibliografia/query";
  var urlEvidencias = urlDefault + ':' + urlDefaultPort + "/evidencia/query";
  var urlFontes = urlDefault + ':' + urlDefaultPort + "/fonte/query";
  var urlSinais = urlDefault + ':' + urlDefaultPort + '/extra/query';
  var urlAdd = urlDefault + ':' + urlDefaultPort + '/extra/add';
  var urlUpdate = urlDefault + ':' + urlDefaultPort + '/extra/update';

  //escalas
  var format = d3.time.format("%Y-%m-%d");
  var legivel = d3.time.format("%d/%m/%Y");
  var escalaRange = d3.scale.pow().exponent(3.5).domain([1, 1000]).rangeRound([0, 500000]);
  var escalaRaio = d3.scale.pow().exponent(.5).domain([0, 200]).range([0, 10]);
  //var escalaRaio = d3.scale.linear().domain([0, 1000]).range([0, 1000]);
  var color = d3.scale.linear().domain([0, 5]).range(["#F1F3F2", "hsl(228,30%,40%)"]).interpolate(d3.interpolateHcl);

  var equipeTemplate;

  var wTela, hTela;

  var qtdePacotes = 10;
  var qtdeListas = 8;

  function afterLoad() {

    wTela = $(window).width();
    hTela = $(window).height();
    diameter = 0.9 * hTela;

    equipeTemplate = $('#janela-tweets').html();
    Mustache.parse(equipeTemplate);


    $('#total_carga').html(qtdePacotes + qtdeListas);

    totalTweets = 60000;


    //criaFormulario();
    checarLogin();
    configuraDashboard();
    $('.desconectar').on('click', desfazerLogin);

  }

  /*************************

  LOGIN

  ***********************/

  //Processo de login EXTREMAMENTE temporário; será substituído por um sistema robusto
  //quando o projeto finalmente for ao ar!

  function checarLogin() {
    console.log(window.localStorage.getItem("acesso_projetoFTV"));
    if (window.localStorage.getItem("acesso_projetoFTV") === null) {
      $('.container-login').addClass('ativo');
      $('#login-site').on('click', function(event) {
        event.preventDefault();
        var textoLogin = $('#log_login').val();
        var textoSenha = $('#log_senha').val();
        if ((textoLogin === 'projetoftv') && (textoSenha === 'VcM9mh1X')) { //VcM9mh1X
          window.localStorage.setItem("acesso_projetoFTV", 'acesso_permitido');
          ativaLogin();
        } else {
          alert('Login ou senha incorretas! Tente novamente ou entre em contato.')
        }
      });

    } else {
      ativaLogin();
    }
  }

  function ativaLogin() {
    $('.container-login').removeClass('ativo');

    checaNumeroDados().then(function(numeroTotal) {

      totalTweets = numeroTotal[0]['count(*)'];

      baixaBaseDados(qtdePacotes).then(function() {

        /* 
        Argumento 0 => lista de descritores
        Argumento 1 => tema
        Argumento 2 => subtema
        Argumento 3 => iniciativa
        Argumento 4 => fases
        Argumento 5 => bibliografia
        Argumento 6 => evidencias
        Argumento 7 => fontes
        Argumento 8 => paises
        Argumento 9 ~ X => dados twitter
        */
        console.log(arguments);

        lido.descritores = arguments[0][0];
        lido.tweetsminimo = [];

        criaFormulario(arguments);

        for (var i = 9; i < arguments.length; i++) {
          lido.tweetsminimo = lido.tweetsminimo.concat(arguments[i][0]);
        };

        //manipulação genérica dos dados
        /*lido.contas.forEach(function(d) {
          indice[d.id] = d;
        });*/
        lido.descritores.forEach(function(d) {
          indicedescritor[d.id] = d;
        });
        lido.tweetsminimo.forEach(function(d) {
          //d.descritor = indice[d.idconta].descritor;
          d.retweets = JSON.parse(d.retweets)
        });
        dados = MG.convert.date(lido.tweetsminimo, 'data', "%a %b %e %X %Z %Y");
        var contadorRet = 0;
        dados = dados.filter(function(d) {
          d.semana = getWeekNumber(d.data)[1];
          semanas.push(d.semana);
          contadorRet += d.retweets;
          return (d.texto[0] != "R") && (d.texto[1] != "T")
        });

        lista = dados.map(function(d) {
          return d.idescritor
        }).filter(function(item, pos, self) { //<-remove duplicadas
          return self.indexOf(item) == pos;
        }).sort();
        //contas = lido.contas;
        contas = dados.map(function(d) {
          return {
            "conta": d.usuario,
            "descritor": d.idescritor
          }
        });

        var lista1 = contas.map(function(d) {
          return d.conta;
        });
        lista1.forEach(function(d) {
          tweetslistados[d] = [];
        });
        dados.forEach(function(d) {
          tweetslistados[d.usuario].push(d);
        });

        lista.forEach(function(d) {
          maximosPorDescritor[d] = dados.filter(function(e) {
            return e.idescritor == d
          }).reduce(function(g, h) {
            return Math.max(g, h.retweets)
          }, 0);
        });

        var arr = {};
        for (var i = 0; i < contas.length; i++)
          arr[contas[i]['conta']] = contas[i];
        contas = new Array();
        for (var key in arr)
          contas.push(arr[key]);

        if (QueryString.viz === '1') {
          volume();
        } else {
          timeSeries();
        };

        //qtde-sinais
        if (window.localStorage.getItem("numero_sinais") === null) {
        } else {
          $('#qtde-sinais').text(window.localStorage.getItem("numero_sinais"));
        }

        //qtde-tweets
        if (window.localStorage.getItem("numero_tweets") === null) {
          window.localStorage.setItem("numero_tweets", dados.length);
          $('#qtde-tweets').text(dados.length);
        } else {
          $('#qtde-tweets').text(window.localStorage.getItem("numero_tweets"));
        }

        //qtde-retweets
        if (window.localStorage.getItem("numero_retweets") === null) {
          window.localStorage.setItem("numero_retweets", contadorRet);
          $('#qtde-retweets').text(contadorRet);
        } else {
          $('#qtde-retweets').text(window.localStorage.getItem("numero_retweets"));
        }

        $('.container-loading').addClass('remove');

      }).fail(function() {
        //$('#aviso_load').text('Erro ao carregar a base de dados!')
        d3.json("js/tudojunto2.json", function(lido) {
          lido.contas.forEach(function(d) {
            indice[d.id] = d;
          });
          lido.descritores.forEach(function(d) {
            indicedescritor[d.id] = d;
          });
          lido.tweetsminimo.forEach(function(d) {
            d.descritor = indice[d.idconta].descritor;
            d.retweets = JSON.parse(d.retweets)
          });
          dados = MG.convert.date(lido.tweetsminimo, 'data', "%a %b %e %X %Z %Y");
          lista = dados.map(function(d) {
            return d.descritor
          }).filter(function(item, pos, self) { //<-remove duplicadas
            return self.indexOf(item) == pos;
          });

          contas = dados.map(function(d) {
            return {
              "conta": d.usuario,
              "descritor": d.idescritor
            }
          });
          lista.forEach(function(d) {
            maximosPorDescritor[d] = dados.filter(function(e) {
              return e.idescritor == d
            }).reduce(function(g, h) {
              return Math.max(g, h.retweets)
            }, 0);
          });

          var arr = {};
          for (var i = 0; i < contas.length; i++)
            arr[contas[i]['conta']] = contas[i];
          contas = new Array();
          for (var key in arr)
            contas.push(arr[key]);
          //contas = lido.contas;

          if (QueryString.viz === '1') {
            volume();
          } else {
            timeSeries();
          }
        });

      });

    });
  }

  function desfazerLogin(event) {
    event.preventDefault();
    window.localStorage.removeItem("acesso_projetoFTV");
    location.reload();
  }

  /*************************

  CARREGAR DADOS

  *************************/

  function checaNumeroDados() {
    var defTotal = new $.Deferred();
    $.ajax({
      url: urlTotal,
      method: 'GET',
      success: defTotal.resolve,
      error: defTotal.reject
    });
    return defTotal.promise();
  };

  function baixaBaseDados(n) {

    var promises = [];

    //Baixa Descritores do twitter
    var def1 = new $.Deferred();
    $.ajax({
      url: urlDesc,
      method: 'GET',
      success: def1.resolve,
      error: def1.reject
    });
    promises.push(def1);

    //Baixa Temas
    var defTemas = new $.Deferred();
    $.ajax({
      url: urlTemas,
      method: 'GET',
      success: defTemas.resolve,
      error: defTemas.reject
    });

    defTemas.done(function() {
      $('#num_carga').html(contaPacotes);
      contaPacotes++;
    });

    promises.push(defTemas);

    //Baixa Subtemas
    var defSubtemas = new $.Deferred();
    $.ajax({
      url: urlSubtemas,
      method: 'GET',
      success: defSubtemas.resolve,
      error: defSubtemas.reject
    });

    defSubtemas.done(function() {
      $('#num_carga').html(contaPacotes);
      contaPacotes++;
    });

    promises.push(defSubtemas);

    //Baixa Iniciativas
    var defIniciativas = new $.Deferred();
    $.ajax({
      url: urlIniciativas,
      method: 'GET',
      success: defIniciativas.resolve,
      error: defIniciativas.reject
    });

    defIniciativas.done(function() {
      $('#num_carga').html(contaPacotes);
      contaPacotes++;
    });

    promises.push(defIniciativas);

    //Baixa Fases
    var defFases = new $.Deferred();
    $.ajax({
      url: urlFases,
      method: 'GET',
      success: defFases.resolve,
      error: defFases.reject
    });

    defFases.done(function() {
      $('#num_carga').html(contaPacotes);
      contaPacotes++;
    });

    promises.push(defFases);

    //Baixa Bibliografias
    var defBibliografia = new $.Deferred();
    $.ajax({
      url: urlBibliografia,
      method: 'GET',
      success: defBibliografia.resolve,
      error: defBibliografia.reject
    });

    defBibliografia.done(function() {
      $('#num_carga').html(contaPacotes);
      contaPacotes++;
    });

    promises.push(defBibliografia);

    //Baixa Evidencias
    var defEvidencias = new $.Deferred();
    $.ajax({
      url: urlEvidencias,
      method: 'GET',
      success: defEvidencias.resolve,
      error: defEvidencias.reject
    });

    defEvidencias.done(function() {
      $('#num_carga').html(contaPacotes);
      contaPacotes++;
    });

    promises.push(defEvidencias);

    //Baixa Fontes
    var defFontes = new $.Deferred();
    $.ajax({
      url: urlFontes,
      method: 'GET',
      success: defFontes.resolve,
      error: defFontes.reject
    });

    defFontes.done(function() {
      $('#num_carga').html(contaPacotes);
      contaPacotes++;
    });

    promises.push(defFontes);

    //Baixa Países e Cidades
    var defPaises = new $.Deferred();
    $.ajax({
      url: '../libs/baseform.json',
      method: 'GET',
      dataType: "json",
      success: defPaises.resolve,
      error: defPaises.reject
    });

    defPaises.done(function() {
      $('#num_carga').html(contaPacotes);
      contaPacotes++;
    });

    promises.push(defPaises);

    for (var i = 0; i < n; i++) {
      var def = new $.Deferred();

      $.ajax({
        url: urlDefault + ':' + urlDefaultPort + "/tweets/query?p=" + i + "&qtd=" + totalTweets / n + "&maxretweet=" + maxRetweets + "&minretweet=" + minRetweets,
        method: 'GET',
        success: def.resolve,
        error: def.reject
      });

      def.done(function() {
        $('#num_carga').html(contaPacotes);
        contaPacotes++;
      });

      promises.push(def);
    }
    return $.when.apply(undefined, promises).promise();
  };

  /*************************

  VISUALIZAÇÕES

  *************************/

  function chave(a) {
    return a == 2 ? volume() : timeSeries();
  }

  function volume() {
    $('.alterna-volume').removeClass('ativo');
    $('.alterna-timeseries').addClass('ativo');
    $('.controleselect,#container,#chart').empty();
    $("form.controle").unbind("change");
    $("#container").unbind("click");
    $(".controleselect").css("display", "none");
    $(".controlerange").off();
    $(".controledata").off();
    $(".controleselect").off();
    //arruma os elementos com jquery
    $(".controlerange").rangeSlider({
      bounds: {
        min: 0,
        max: d3.values(maximosPorDescritor).reduce(function(g, h) {
          return Math.max(g, h)
        }, 0)
      }
      /*,
      defaultValues: {
        min: 1,
        max: 169.4
      },
      formatter: function(val) {
        return escalaRange(val);
      }*/
    });
    $(".controlerange").rangeSlider("values", 5, d3.values(maximosPorDescritor).reduce(function(g, h) {
      return Math.max(g, h)
    }, 0));
    $(".controledata").dateRangeSlider({
      bounds: {
        min: new Date(2015, 3, 1),
        max: new Date()
      },
      defaultValues: {
        min: new Date(2015, 5, 1),
        max: new Date(2015, 5, 15)
      },
      step: {
        days: 1
      }
    });
    $('form.controle').change(function() {
      /*      imprimeTreeMap($(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));*/
    });
    $(".controlerange").bind("valuesChanged", function(e, data) {
      $('form.controle').trigger("change");
    });
    $(".controledata").bind("valuesChanged", function(e, data) {
      $('form.controle').trigger("change");
    });

    //

    var pack = d3.layout.pack()
      .padding(2)
      .size([diameter, diameter])
      .value(function(d) {
        return d.size;
      })

    var svg = d3.select("#chart").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    /*    imprimeTreeMap($(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));*/
  };

  function timeSeries() {
    $('.alterna-volume').addClass('ativo');
    $('.alterna-timeseries').removeClass('ativo');
    $(".controleselect,#container,#chart").empty();
    $("form.controle").unbind("change");
    $("#container").unbind("click");
    $(".controleselect").css("display", "block");
    //arruma os elementos com jquery
    $(".controlerange").off();
    $(".controledata").off();
    $(".controleselect").off();
    $.each(lista, function(i, d) {
      $('.controleselect').append($('<option></option>').val(d).html(indicedescritor[d].descritor))
    });
    $(".controlerange").rangeSlider({
      bounds: {
        min: 0,
        max: 100
      }
      /*,
      defaultValues: {
        min: 1,
        max: 169.4 //168.92 (1000 no de 10 a 5mi)
      },
      formatter: function(val) {
        return escalaRange(val);
      }*/
    });
    $(".controledata").dateRangeSlider({
      bounds: {
        min: new Date(2015, 3, 1),
        max: new Date()
      },
      defaultValues: {
        min: new Date(2015, 5, 1),
        max: new Date(2015, 5, 15)
      },
      step: {
        days: 1
      }
    });
    $('.controleselect').change(function() {
      ajustaRange();
      imprimeMG($("select.controleselect option:selected").val(), $(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));
    });
    $(".controlerange").bind("valuesChanged", function(e, data) {
      imprimeMG($("select.controleselect option:selected").val(), $(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));
    });
    $(".controledata").bind("valuesChanged", function(e, data) {
      imprimeMG($("select.controleselect option:selected").val(), $(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));
    });
    /*$('#container').on('click', function() {
      $("#texto").html(varglobal.tweets.sort(function(a, b) {
        return b.retweets - a.retweets
      }).reduce(function(e, f) {
        return e + (indice[f.idconta].conta + " - " + f.texto + " - " + f.retweets + "<br>")
      }, ""));
    });*/
    ajustaRange();
    imprimeMG($("select.controleselect option:selected").val(), $(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));
    $('.container-loading').addClass('remove');

    imprimeHeatMapVolume();

    $('#container').off();
    $('#container').on('click', function() {

      $('.lista-tweets').empty();
      var listaDia = varglobal.tweets.sort(function(a, b) {
        return b.retweets - a.retweets
      });

      $('#dia-escolhido').text(legivel(varglobal.data));
      //$('#num-tweet').text(varglobal.tweets.length);
      $('#descricao-janela-lista').text('Mostrando os ' + listaDia.length + ' tweets encontrados no dia ' + legivel(varglobal.data));

      for (var i = 0; i < listaDia.length; i++) {
        var rendered = Mustache.render(equipeTemplate, {
          autor: varglobal.tweets[i].usuario,
          tweet: varglobal.tweets[i].texto,
          retweets: varglobal.tweets[i].retweets,
          idtweet: varglobal.tweets[i].idtweet,
          tempo: legivel(varglobal.data)
        });
        $('.lista-tweets').append(rendered);
      }

      $('.janela-dados').addClass('ativo');



    });

  };

  function imprimeTreeMap(range, dia) {
    d3.select("svg").remove();

    pack = d3.layout.pack()
      .padding(8)
      .size([diameter, diameter])
      .value(function(d) {
        return d.size;
      })

    svg = d3.select("#chart").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var root = {
      name: "raiz",
      children: []
    };
    lista.forEach(function(d) {
      root.children.push({
        "name": indicedescritor[d].descritor,
        "iddescritor": d,
        "children": []
      })
    });
    root.children.forEach(function(d) {
      d.children = contas.filter(function(e) {
        return e.descritor == d.iddescritor;
      });
    });
    root.children.forEach(function(d) {
      d.children.forEach(function(e) {
        e.name = e.conta;
        e.childrenXXX = tweetslistados[e.conta].filter(function(f) {
          return (f.usuario == e.conta) && (f.data >= dia.min) && (f.data <= dia.max) && (f.retweets >= range.min) && (f.retweets <= range.max);
        });
        e.size = e.childrenXXX.reduce(function(g, h) {
          return g + h.retweets
        }, 0);
        //e.size = escalaRaio(e.size);
      });
    });

    root.children.forEach(function(d) {
      d.children = d.children.filter(function(e) {
        return (e.size != 0);
      });
    });


    root.children = root.children.filter(function(d) {
      return (d.children.length > 0);
    });

    root.children.forEach(function(d) {
      d.size = d.children.reduce(function(g, h) {
        return g + h.size
      }, 0);
      d.childrenYYY = d.children;
      delete d.children;
      d.size = escalaRaio(d.size);
    });


    var focus = root,
      nodes = pack.nodes(root),
      view;
    var circle = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("class", function(d) {
        return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
      })
      .style("fill", function(d) {
        return d.children ? color(d.depth) : "#198d9f";
      })
      // .on("click", function(d) {
      //         if (focus !== d) zoom(d), d3.event.stopPropagation();
      //       });
      // .on("click", function(d) {
      //           if (focus !== d) {
      //             d3.event.stopPropagation();
      //             if (focus.depth === 0) {
      //               if (d.depth !== 2) {
      //                 zoom(d);
      //               }
      //             } else if (focus.depth === 1) {
      //               if (d.depth === 2) {
      //                 //console.log(d);
      //                 carregaJanela(d);
      //                 $('.janela-dados').addClass('ativo');
      //                 /////////////////////////////////////
      //                 /*carregaJanela(d.id, d.descritor, root);
      //                 $('.janela-dados').addClass('ativo');*/
      //                 //FAZ ALGUMA COISA AQUI?!?!
      //                 //////////////////////////////////////
      //               } else {
      //                 zoom(root);
      //               }
      //             } else {}
      //           }
      //         });


    .on("click", function(d) {
      if (focus !== d) {
        d3.event.stopPropagation();
        if (focus.depth === 0) {
          if (d.depth === 1) {
            //zoom(d);
            carregaJanela(d);
            $('.janela-dados').addClass('ativo');
          }
        }
      }
    });

    var text = svg.selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) {
        return d.parent === root ? 1 : 0;
      })
      .style("display", function(d) {
        return d.parent === root ? null : "none";
      })
      .text(function(d) {
        return d.name;
      });

    var node = svg.selectAll("circle,text");

    d3.select("#chart")
    //.style("background", color(-1))
    .on("click", function() {
      zoom(root);
    });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus;
      focus = d;

      var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) {
            zoomTo(i(t));
          };
        });

      transition.selectAll("text")
        .filter(function(d) {
          return d.parent === focus || this.style.display === "inline";
        })
        .style("fill-opacity", function(d) {
          return d.parent === focus ? 1 : 0;
        })
        .each("start", function(d) {
          if (d.parent === focus) this.style.display = "inline";
        })
        .each("end", function(d) {
          if (d.parent !== focus) this.style.display = "none";
        });
    }

    function zoomTo(v) {
      var k = diameter / v[2];
      view = v;
      node.attr("transform", function(d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
      });
      circle.attr("r", function(d) {
        return d.r * k;
      });
    }

    $('.container-loading').addClass('remove');
  };

  function imprimeMG(id, range, data) {
    var padrao = {
      full_width: true,
      height: 500,
      target: "#container",
      x_accessor: "data",
      y_accessor: "retweets",
      xax_count: 12,
      mouseover: function(d, i) {
        varglobal = d;
        d3.select('.mg-active-datapoint')
          .attr("transform", "translate(" + d3.transform(d3.select(".mg-active-datapoint-container").attr("transform")).translate[0] / -2 + ",0)")
          .style("text-anchor", "middle")
          .text(d.data.getDate() + "/" + (d.data.getMonth() + 1) + "/" + d.data.getFullYear() + " Tweets: " + d.tweets.length + " / Soma de Retweets: " + d.retweets);
      },
      mouseout: function(d, i) {
        varglobal = {};
      },
      interpolate: "monotone",
      interpolate_tension: 0.7
    };
    var dias = [];
    for (var d = new Date(data.min); d <= new Date(data.max); d.setDate(d.getDate() + 1)) {
      dias.push({
        "data": new Date(d),
        "dia": format(new Date(d)),
        "retweets": 0,
        "tweets": []
      });
    };
    var diaMax = data.max;
    diaMax.setDate(data.max.getDate() + 1);
    var diasMapa = dias.map(function(d) {
      return d.dia;
    });
    padrao.title = indicedescritor[id].descritor;
    var filtradados = dados.filter(function(e) {
      return (e.idescritor == id) && (e.data >= data.min) && (e.data <= diaMax) && (e.retweets >= range.min) && (e.retweets <= range.max);
    });
    filtradados.forEach(function(d) {
      if (diasMapa.indexOf(format(d.data)) > -1) dias[diasMapa.indexOf(format(d.data))].tweets.push(d)
    });
    dias.forEach(function(d) {
      d.retweets = d.tweets.reduce(function(e, f) {
        return e + f.retweets
      }, 0);
    });
    padrao.data = dias;
    MG.data_graphic(padrao);
  };


  function imprimeHeatMapVolume() {

    /*  d3.select("svg").remove();
  $('#regions_div,#heatmap,#grafo,#items').empty();
  $('#regions_div,#heatmap,#grafo,#items').off();
  $("#items").css("display", "block");
  //$("#items").off();
  $('#heatmap').addClass('ativo');
  $('#regions_div, #grafo').removeClass('ativo');
  $('.visu-controles-mapas, .visu-controles-force, .legenda-bloco').removeClass('ativo');
  $('.visu-controles-heatmap').addClass('ativo');
  $('.force-node-texto, .abre-filtros, .zoom').removeClass('ativo');*/
    d3.select("svg").remove();
    var semanal = {};
    //var semanas = []; //cria global lá emcima e apaga esse

    semanas = semanas.filter(function(item, pos, self) { //<-remove duplicadas
      return self.indexOf(item) == pos;
    }).sort(function(a, b) {
      return a - b;
    });
    console.log(semanas);

    lista.forEach(function(d) {
      semanal[d] = {};
      semanas.forEach(function(e) {
        semanal[d][e] = [];
      })
    });

    dados.forEach(function(d) {
      semanal[d.idescritor][d.semana].push(d);
    })

    var colunas = semanas.slice(semanas.length - 4);
    var linhas = lista.slice(0);
    var celulas = [];

    console.log(colunas, linhas);

    var somatorios = [];

    linhas.forEach(function(d) {
      colunas.forEach(function(e) {
        var atual = {
          "source": d,
          "target": e,
          "value": semanal[d][e].reduce(function(g, h) {
            return g + h.retweets;
          }, 0),
          "qtde": semanal[d][e].length,
          "row": linhas.indexOf(d),
          "col": colunas.indexOf(e)
        };
        celulas.push(atual);
        somatorios.push(JSON.parse(atual.value));
      });
    });
    console.log(somatorios);
    somatorios = somatorios.sort(function(a, b) {
      return a - b;
    });
    console.log(somatorios);

    var escalavermelho = d3.scale.pow().exponent(.33).domain([0, somatorios[somatorios.length - 1]]).range(["#FFFFFF", "#8e298e"]);

      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-50, 0])
        .html(function(z) {
          return z.qtde + " Tweets";
      });

    var gridSize = 15,
      h = gridSize,
      w = gridSize*2,
      rectPadding = 60;
    console.log(somatorios);

    var escalaraioheat = d3.scale.pow().exponent(.33).domain([0, somatorios[somatorios.length - 1]]).range([0, gridSize * .5]);

    var margin = {
        top: 80,
        right: 80,
        bottom: 20,
        left: 180
      };
      var widChart = $('#chart').width();
      width = wTela - margin.left - margin.right;
      height = hTela - margin.top - margin.bottom;

    var svg = d3.select("#chart").append("svg")
      .attr("width", widChart)
      .attr("height", 700)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var heatMap = svg.selectAll(".heatmap")
      .data(celulas, function(d) {
        return d.col + ':' + d.row;
      })
      /*      .enter().append("svg:rect")
      .attr("x", function(d) {
        return d.col * w;
      })
      .attr("y", function(d) {
        return d.row * h;
      })
      .attr("width", function(d) {
        return w;
      })
      .attr("height", function(d) {
        return h;
      })*/
      .enter().append("circle")
      .attr("cx", function(d) {
        return (d.col * w) + (gridSize);
      })
      .attr("cy", function(d) {
        return (d.row * h) + (gridSize / 2);
      })
      .attr("r", function(d) {
        return escalaraioheat(d.value);
      }) //ALTERAR  no rowlabel e no collabel, a hora que move as celulas, trocar x por cx e y por cy
      .attr("class", function(d) {
        return "cell c" + d.col + " r" + d.row;
      })
      .style("fill", function(d) {
        return escalavermelho(d.value);
      });


    var heatMap2 = svg.selectAll(".heatmap")
      .data(celulas, function(d) {
        return d.col + ':' + d.row;
      }).enter().append("circle")
      .attr("cx", function(d) {
        return (d.col * w) + (gridSize);
      })
      .attr("cy", function(d) {
        return (d.row * h) + (gridSize / 2);
      })
      .attr("r", gridSize / 2)
      .attr("class", function(d) {
        return "cell c" + d.col + " r" + d.row;
      })
      .style("opacity", 0)
      .on('mouseover', function(d) {
        tip.show(d);
        d3.selectAll(".c" + d.col + ",.r" + d.row + ",.cL" + d.col + ",.rL" + d.row).classed("highlighted", true);
      })
      .on('mouseout', function(d) {
        tip.hide(d);
        d3.selectAll(".c" + d.col + ",.r" + d.row + ",.cL" + d.col + ",.rL" + d.row).classed("highlighted", false);
      })
      .on('click', function(d) {
        console.log(d.source, d.target);
        //semanal[d.source][d.target] contem os tweets daquela celula clicada, d.qtde é a quantidade de tweets, d.value é a soma de retweetadas
      });

    var rowLabels = svg.append("g")
      .selectAll(".row.label")
      .data(linhas)
      .enter()
      .append("text")
      .text(function(d) {
        return indicedescritor[d].descritor;
      })
      .attr("x", 0)
      .attr("y", function(d) {
        return linhas.indexOf(d) * h;
      })
      .attr("class", function(d) {
        return "row label rL" + linhas.indexOf(d);
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + h / 1.5 + ")")
      .on('click', function(d) {
        var ordem = celulas.filter(function(e) {
          return e.source == d
        }).sort(function(a, b) {
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        });
        var ordemMapa = [];
        ordem.forEach(function(f) {
          ordemMapa.push(f.target);
        });
        var t = svg.transition().duration(3000);
        t.selectAll(".cell").attr("cx", function(g) {
          return (ordemMapa.indexOf(g.target) * w) + (gridSize / 2);
        });
        t.selectAll(".col").attr("y", function(g) {
          return (ordemMapa.indexOf(g) * w);
        });
      });

    var colLabels = svg.append("g")
      .selectAll(".col.label")
      .data(colunas)
      .enter()
      .append("text")
      .text(function(d) {
        return "Semana " + (colunas.indexOf(d) + 1);
      })
      .attr("x", 0)
      .attr("y", function(d) {
        return colunas.indexOf(d) * w;
      })
      .attr("class", function(d) {
        return "col label cL" + colunas.indexOf(d);
      })
      .style("text-anchor", "left")
      .attr("transform", "translate(" + w / 2 + ",-6) rotate (-90)")
      .on('click', function(d) {
        var ordem = celulas.filter(function(e) {
          return e.target == d
        }).sort(function(a, b) {
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        });
        var ordemMapa = [];
        ordem.forEach(function(f) {
          ordemMapa.push(f.source);
        });
        var t = svg.transition().duration(3000);
        t.selectAll(".cell").attr("cy", function(g) {
          return (ordemMapa.indexOf(g.source) * h) + (gridSize / 2);
        });
        t.selectAll(".row").attr("y", function(g) {
          return ordemMapa.indexOf(g) * h;
        });
      });

    $('.container-loading').addClass('remove');
  };

  function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
      // Return array of year and week number
    return [d.getFullYear(), weekNo];
  }

  function ajustaRange() {

    $(".controlerange").rangeSlider({
      bounds: {
        min: 0,
        max: maximosPorDescritor[$("select.controleselect option:selected").val()]
      }
    });
    $(".controlerange").rangeSlider("values", 0, maximosPorDescritor[$("select.controleselect option:selected").val()]);
    //imprimeMG($("select.controleselect option:selected").val(), $(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));
  };

  /*************************

  DASHBOARD

  ***********************/

  function configuraDashboard() {

    //Fecha Modal
    $('.modal-close, .md-overlay').on('click', function(e){
      e.preventDefault();      
      $('.md-modal').removeClass('md-show');      
    });

    //Abre Modal
    $('.js-abre-modal').on('click', function(e){
      e.preventDefault();      
      var alvo = '#' + $(this).data('modal');
      $(alvo).addClass('md-show');
    });

    $('.abre-menu').on('click', function(event) {
      event.preventDefault();
      $('.container-menu-nav').toggleClass('ativo');
    });

    $('.abre-salvar-sinal, .close-janela-save').on('click', function(event) {
      event.preventDefault();
      $('.janela-save').toggleClass('ativo');
    });

    $('.abre-filtros, .close-janela-filtros').on('click', function(event) {
      event.preventDefault();
      $('#janela-filtros').toggleClass('ativo');
    });

    $('.close-janela').on('click', function(event) {
      event.preventDefault();
      $('.janela-dados').removeClass('ativo');
    });

    $('body').on('click', '.editar-sinal', editarSinal);

    $('#salva-sinal').on('click', salvaSinal);

    $('.seleciona-viz').on('click', selecionaViz);

    $('.alterna-volume').on('click', function(event) {
      event.preventDefault();

      $('.titulo-viz').html('Volume de Retweets');
      $('.container-loading').removeClass('remove');
      $('#titulo-loading').html('Processando dados...');
      $('#aviso_load').empty();

      window.setTimeout(function() {
        volume();
      }, 1200);


    });

    $('.alterna-timeseries').on('click', function(event) {
      event.preventDefault();

      $('.titulo-viz').html('Time Series');
      $('.container-loading').removeClass('remove');
      $('#titulo-loading').html('Processando dados...');
      $('#aviso_load').empty();

      window.setTimeout(function() {
        timeSeries();
      }, 1200);


    });

  }

  function selecionaViz(event) {
    event.preventDefault();
    var a = $(this).data('alvo');
    var titulo = $(this).data('titulo');
    $('.item-menu').removeClass('ativo');
    $(this).parent().addClass('ativo');
    $('.titulo-viz').html(titulo);
    $('.container-menu-nav').removeClass('ativo');
    return a == 1 ? volume() : timeSeries();
  }

  function salvaSinal(event) {

    event.preventDefault();

    // //dados do cliente
    var tweetid = $('#sign_tweetid').val();
    var nome = $('#sign_nome').val();
    var conteudo = $('#sign_conteudo').val();
    var infoadd = $('#sign_infoadd').val();
    var url = $('#sign_url').val();
    var tema = $('#sign_tema').val();
    var subtema = ["", ""];
    $('.colunas-subtemas input:checked').each(function() {
      subtema.unshift($(this).attr('name'));
    });

    var tag1 = subtema[0];
    var tag2 = subtema[1];
    var iniciativa = $('#sign_iniciativa').val();
    var bibliografia = $('#sign_bibliografia').val();
    var produto = $('#sign_produto').val();
    var fase = $('#sign_fase').val();
    var pais = $('#sign_pais').val();
    var cidade = $('#sign_cidade').val();
    var fonte = $('#sign_fonte').val();
    var evidencias = $('#sign_evidencias').val();
    var protagonista = $('#sign_protagonista').val();

    var objDados = {
      "nome": nome,
      "descricao": conteudo,
      "url": url,
      "tema": tema,
      "tag1": tag1,
      "tag2": tag2,
      "iniciativa": iniciativa,
      "produto": "",
      "fase": fase,
      "protagonista": protagonista,
      "bibliografia": bibliografia,
      "evidencias": evidencias,
      "fonte": fonte,
      "pais": pais,
      "cidade": cidade,
      "info_add": infoadd,
      "is_tweet": false,
      "id_tweet": tweetid,
      "urlvideo": ""
    };

    for (var propriedade in objDados) {
      if (objDados.hasOwnProperty(propriedade)) {
        if (objDados[propriedade] == null) objDados[propriedade] = "";
      }
    };

    $('.sucesso').addClass('ativo').html('Salvando dados, aguarde...');

    $.ajax({
      type: "POST",
      url: urlAdd,
      data: objDados,
      success: function(data) {
        $('.sucesso').html('Sinal salvo com sucesso!');
        var timeoutID = window.setTimeout(function() {
          $('.sucesso').removeClass('ativo');
        }, 3000);
        console.log(data);
      },
      error: function(data) {
        $('.sucesso').html('Erro ao salvar o sinal!');
        console.log(data);
      }
    });
  }

  function editarSinal(event) {
    event.preventDefault();
    var $sinalInv = $(this).parents('.tweet-single').find('.sinal-invisivel');
    var objDados = {
      "nome": $sinalInv.data('nome'),
      "conteudo": $sinalInv.data('conteudo'),
      "url": $sinalInv.data('url'),
      "idtweet": $sinalInv.data('tweetid')
    };
    incorporarDados(objDados);
    $('.janela-save').addClass('ativo');
    $('.janela-dados').removeClass('ativo');

  }

  function incorporarDados(objDados) {
    $('#sign_nome').val(objDados['nome']);
    $('#sign_conteudo').val(objDados['conteudo']);
    $('#sign_url').val(objDados['url']);
    $('#sign_tweetid').val(objDados['idtweet']);
  }

  function criaFormulario(arguments) {

    arguments[8][0].nos.forEach(function(d) {
      d.classe = d.classe[0];
      nodemap[d.name] = d;
    });

    var tema = arguments[1][0].map(function(d) {
      return d.pt_br.trim()
    });

    var subtema = arguments[2][0].map(function(d) {
      return d.tags.trim()
    });
    subtema.splice(subtema.indexOf('Innovation'), 1);

    var iniciativa = arguments[3][0].map(function(d) {
      return d.descricao.trim()
    });

    arguments[4][0].push({
      descricao: "Aplicativo",
      id: 999
    });
    var fase = arguments[4][0].map(function(d) {
      return d.descricao.trim()
    });

    var bibliografia = arguments[5][0].map(function(d) {
      return d.descricao.trim()
    });
    bibliografia.splice(subtema.indexOf('teste'), 1);

    var evidencias = arguments[6][0].map(function(d) {
      return d.descricao.trim()
    });

    var fonte = arguments[7][0].map(function(d) {
      return d.descricao.trim()
    });

    var pais = arguments[8][0].nos.filter(function(d) {
      return d.classe == "pais"
    }).map(function(d) {
      return d.name
    });

    var cidade = arguments[8][0].nos.filter(function(d) {
      return d.classe == "cidade"
    }).map(function(d) {
      return d.name
    });


    $.each(tema, function(i, d) {
      $('#sign_tema').append($('<option></option>').val(d).html(d))
    });

    $.each(iniciativa, function(i, d) {
      $('#sign_iniciativa').append($('<option></option>').val(d).html(d))
    });

    $.each(bibliografia, function(i, d) {
      $('#sign_bibliografia').append($('<option></option>').val(d).html(d))
    });

    $.each(fase, function(i, d) {
      $('#sign_fase').append($('<option></option>').val(d).html(d))
    });

    $.each(pais, function(i, d) {
      $('#sign_pais').append($('<option></option>').val(d).html(d))
    });

    $.each(cidade, function(i, d) {
      $('#sign_cidade').append($('<option></option>').val(d).html(d))
    });

    $.each(fonte, function(i, d) {
      $('#sign_fonte').append($('<option></option>').val(d).html(d))
    });

    $.each(evidencias, function(i, d) {
      $('#sign_evidencias').append($('<option></option>').val(d).html(d))
    });

    $.each(subtema, function(i, d) {

      var $div = $('<div></div>');
      $('<input type="checkbox" name="' + d + '" id="subtema' + i + '" >').val(d).appendTo($div);
      $('<label class="check" for="subtema' + i + '"></label>').html(d).appendTo($div);
      $('.colunas-subtemas').append($div);

    });

    $('.habilita-subtema, .close-subtema').on('click', function(event) {
      event.preventDefault();
      $('.lista-subtemas').toggleClass('ativo');
    });
  };
  // carregaJanela(d.id, d.descritor, root);
  function carregaJanela(d) {
    $('#nome-perfil').text(d.name);
    //$('#num-tweet').text(d.childrenXXX.length);

    $('.lista-tweets').empty();
    var tweets = [];
    d.childrenYYY.forEach(function(u) {
      tweets = tweets.concat(u.childrenXXX);
    })
    tweets.sort(function(a, b) {
      return b.retweets - a.retweets;
    });
    tweets = tweets.slice(0, 199);

    $('#descricao-janela-lista').text('Mostrando os ' + tweets.length + ' tweets mais importantes do tema ' + d.name);
    for (var i = 0; i < tweets.length; i++) {
      var child = tweets[i];

      var rendered = Mustache.render(equipeTemplate, {
        tempo: legivel(child.data),
        tweet: child.texto,
        retweets: child.retweets,
        autor: child.usuario,
        idtweet: child.idtweet
      });
      $('.lista-tweets').append(rendered);
    }
  }

  return {
    inicializa: afterLoad
  }

})();

$(document).ready(loadpage.inicializa);