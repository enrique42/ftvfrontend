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

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

var loadpage = (function() {

  var corFundo = '#F1F3F2';
  var corFundoMapa = '#ECECEC';
  var corAzul = '#2c6d42';
  var corAzulClaro = '#6bc288';
  var entradas = [];
  var nodemap = [];
  var linhas = [],
    colunas = [],
    celulas = [],
    linhasB = [],
    colunasB = [],
    celulasB = [],
    linhasC = [],
    colunasC = [],
    celulasC = [],
    entradas = [],
    dadosBrasil = [],
    pontosBrasil = [],
    dadosMundo = [],
    pontosMundo = [],
    temasBrasil = [],
    temasMundo = [],
    listaini = [],
    listapro = [],
    listabib = [],
    listaevi = [];


  var tema, subtema, iniciativa, fase, bibliografia, evidencias, pais, cidade, fonte;
  var armazenaLista;

  var contaPacotes = 0;

  var globLinks;

  var copia = {},
    dadosheat = {},
    linktemas = [],
    linknomes = [],
    nodes = {},
    nodemapforce = [],
    linkmap = {};

  var wTela, hTela;

  var sinalTemplate;

  var classesEscondidas = [];

  var nomeSelecionadas = null;

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

  function afterLoad() {

    $('#total_carga').html(8);

    wTela = $('.container-visu').width();
    hTela = $('.container-visu').height();

    sinalTemplate = $('#janela-lista-sinais').html();
    Mustache.parse(sinalTemplate);

    //checarLogin();
    ativaLogin();
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
    baixaBaseDados().then(function() {
      carregaJson(arguments);
      $('.container-loading').addClass('remove');
    });
  }

  function desfazerLogin(event) {
    event.preventDefault();
    window.localStorage.removeItem("acesso_projetoFTV");
    location.reload();
  }

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
      limparFormulario();
    });

    $('.abre-filtros, .close-janela-filtros').on('click', function(event) {
      event.preventDefault();
      $('#janela-filtros').toggleClass('ativo');
    });

    $('#salva-sinal').on('click', salvaSinal);

    $('.close-janela-mostra-sinais').on('click', function(event) {
      event.preventDefault();
      $('#janela-mostra-sinais').removeClass('ativo');
    });

    $('.seleciona-viz').on('click', selecionaViz);

    $('.force-node-texto').on('click', function(event) {
      event.preventDefault();
      mostraSinais(armazenaLista);
    })

    $('body').on('click', '.editar-sinal', editarSinal);

    $('.ver-abrangencia').on('click', function(e){
      e.preventDefault();
      var listinha = entradas.filter(function(d) {
        var tema = $("#items").val();
        if (tema === "Todos") {
          return ( (d.pais === "Brasil") && (d.cidade === '') );
        } else {
          return ( (d.pais === "Brasil") && (d.cidade === '') && (d.tema === tema) ) 
        }
      });
     if (listinha.length > 0) {
        mostraSinais(listinha);
      };
    })

    $('#filtro_tema').on('change', function() {
      var alvo = $(this).val();
      d3.selectAll("circle,path").classed("escondido", false);
      d3.selectAll("circle,path").classed("escondidoDeFato", false);
      vizinhoFiltro(alvo, globLinks);
      nomeSelecionadas = alvo;
      d3.selectAll('.tema').each(function(d) {
        if (d.name === alvo) {

          var listinha = entradas.filter(function(e) {
            if (d.classe[0] === "subtema") return ((e.tag1 == d.name) || (e.tag2 == d.name))
            else return e[d.classe[0]] === d.name;
          });

          $('#nome-node').html(d.name);
          armazenaLista = listinha;
          $('.force-node-texto').addClass('ativo');
        }
      })


    });

    $('#filtro_subtema').on('change', function() {
      var alvo = $(this).val();
      d3.selectAll("circle,path").classed("escondido", false);
      d3.selectAll("circle,path").classed("escondidoDeFato", false);
      vizinhoFiltro(alvo, globLinks);
      nomeSelecionadas = alvo;
      d3.selectAll('.subtema').each(function(d) {
        if (d.name === alvo) {

          var listinha = entradas.filter(function(e) {
            if (d.classe[0] === "subtema") return ((e.tag1 == d.name) || (e.tag2 == d.name))
            else return e[d.classe[0]] === d.name;
          });

          $('#nome-node').html(d.name);
          armazenaLista = listinha;
          $('.force-node-texto').addClass('ativo');
        }
      })
    });

    $('#filtro_iniciativa').on('change', function() {
      var alvo = $(this).val();
      d3.selectAll("circle,path").classed("escondido", false);
      d3.selectAll("circle,path").classed("escondidoDeFato", false);
      vizinhoFiltro(alvo, globLinks);
      nomeSelecionadas = alvo;
      d3.selectAll('.iniciativa').each(function(d) {
        if (d.name === alvo) {

          var listinha = entradas.filter(function(e) {
            if (d.classe[0] === "subtema") return ((e.tag1 == d.name) || (e.tag2 == d.name))
            else return e[d.classe[0]] === d.name;
          });

          $('#nome-node').html(d.name);
          armazenaLista = listinha;
          $('.force-node-texto').addClass('ativo');
        }
      })
    });

    $('#filtro_bibliografia').on('change', function() {
      var alvo = $(this).val();
      d3.selectAll("circle,path").classed("escondido", false);
      d3.selectAll("circle,path").classed("escondidoDeFato", false);
      vizinhoFiltro(alvo, globLinks);
      nomeSelecionadas = alvo;
      d3.selectAll('.bibliografia').each(function(d) {
        if (d.name === alvo) {

          var listinha = entradas.filter(function(e) {
            if (d.classe[0] === "subtema") return ((e.tag1 == d.name) || (e.tag2 == d.name))
            else return e[d.classe[0]] === d.name;
          });

          $('#nome-node').html(d.name);
          armazenaLista = listinha;
          $('.force-node-texto').addClass('ativo');
        }
      })
    });

    $('#filtro_fase').on('change', function() {
      var alvo = $(this).val();
      d3.selectAll("circle,path").classed("escondido", false);
      d3.selectAll("circle,path").classed("escondidoDeFato", false);
      vizinhoFiltro(alvo, globLinks);
      nomeSelecionadas = alvo;
      d3.selectAll('.fase').each(function(d) {
        if (d.name === alvo) {

          var listinha = entradas.filter(function(e) {
            if (d.classe[0] === "subtema") return ((e.tag1 == d.name) || (e.tag2 == d.name))
            else return e[d.classe[0]] === d.name;
          });

          $('#nome-node').html(d.name);
          armazenaLista = listinha;
          $('.force-node-texto').addClass('ativo');
        }
      })
    });

    $('#filtro_pais').on('change', function() {
      var alvo = $(this).val();
      d3.selectAll("circle,path").classed("escondido", false);
      d3.selectAll("circle,path").classed("escondidoDeFato", false);
      vizinhoFiltro(alvo, globLinks);
      nomeSelecionadas = alvo;
      d3.selectAll('.pais').each(function(d) {
        if (d.name === alvo) {

          var listinha = entradas.filter(function(e) {
            if (d.classe[0] === "subtema") return ((e.tag1 == d.name) || (e.tag2 == d.name))
            else return e[d.classe[0]] === d.name;
          });

          $('#nome-node').html(d.name);
          armazenaLista = listinha;
          $('.force-node-texto').addClass('ativo');
        }
      })
    });

    $('#filtro_evidencias').on('change', function() {
      var alvo = $(this).val();
      d3.selectAll("circle,path").classed("escondido", false);
      d3.selectAll("circle,path").classed("escondidoDeFato", false);
      vizinhoFiltro(alvo, globLinks);
      nomeSelecionadas = alvo;
      d3.selectAll('.evidencias').each(function(d) {
        if (d.name === alvo) {

          var listinha = entradas.filter(function(e) {
            if (d.classe[0] === "subtema") return ((e.tag1 == d.name) || (e.tag2 == d.name))
            else return e[d.classe[0]] === d.name;
          });

          $('#nome-node').html(d.name);
          armazenaLista = listinha;
          $('.force-node-texto').addClass('ativo');
        }
      })
    });

    $('.filtro-legenda').on('click', function(event) {
      event.preventDefault();
      var tipo = $(this).data('tipo');
      $(this).toggleClass('ativo');

      classesEscondidas = [];
      $('.filtro-legenda').each(function() {
        if ($(this).hasClass('ativo')) {
          var thisTipo = $(this).data('tipo');
          classesEscondidas.push(thisTipo);
        };
      });

      if (nomeSelecionadas == null) {
        vizinhoLegenda(classesEscondidas);  
      } else {
        d3.selectAll("circle,path").classed("escondido", false);
        d3.selectAll("circle,path").classed("escondidoDeFato", false);
        d3.selectAll("circle,path").classed("escondidoLeg", false);
        vizinhoLegenda(classesEscondidas);
        //console.log('Xaprosca ' + nomeSelecionadas);
        vizinhoFiltro(nomeSelecionadas, globLinks);
      }

      

    });

    $('.voltar-mundo').on('click', function(event) {
      event.preventDefault();
      mapaMundo();
      $('.titulo-viz').text('Sinais Geolocalizados (Mundo)');

    });

  }

  function mostraSinais(lista) {
    $('.lista-sinais').empty();
    for (var i = 0; i < lista.length; i++) {

      var item = lista[i];
      var protag = "Não";
      if (item.protagonista == 1) {
        protag = "Sim";
      }
      var rendered = Mustache.render(sinalTemplate, {
        sinalid: item.id,
        tweetid: item.id_tweet,
        nome: item.nome,
        desc: item.descricao,
        info_add: item.info_add,
        url: item.url,
        tema: item.tema,
        tag1: item.tag1,
        tag2: item.tag2,
        iniciativa: item.iniciativa,
        bibliografia: item.bibliografia,
        fase: item.fase,
        pais: item.pais,
        cidade: item.cidade,
        fonte: item.fonte,
        evidencias: item.evidencias,
        protagonista: protag
      });
      $('.lista-sinais').append(rendered);
    }

    $('#janela-mostra-sinais').addClass('ativo');
  }

  function salvaSinal(event) {

    event.preventDefault();

    // //dados do cliente
    var sinalid = $('#sign_sinalid').val();
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

    var edicao = $('#sign_editar').val();

    if (edicao === "false") {
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
          limparFormulario();
        },
        error: function(data) {
          $('.sucesso').html('Erro ao salvar o sinal!');
          console.log(data);
          limparFormulario();
        }
      });
    } else {
      objDados.id = sinalid;
      $.ajax({
        type: "POST",
        url: urlUpdate,
        data: objDados,
        success: function(data) {
          $('.sucesso').html('Sinal editado com sucesso!');
          var timeoutID = window.setTimeout(function() {
            $('.sucesso').removeClass('ativo');
          }, 3000);
          console.log(data);
          limparFormulario();
        },
        error: function(data) {
          $('.sucesso').html('Erro ao editar o sinal!');
          console.log(data);
          limparFormulario();
        }
      });
    }



  }

  function editarSinal(event) {
    event.preventDefault();
    var $sinalInv = $(this).parents('.sinais-single').find('.sinal-invisivel');
    var objDados = {
      "sinalid": $sinalInv.data('sinalid'),
      "tweetid": $sinalInv.data('tweetid'),
      "nome": $sinalInv.data('nome'),
      "conteudo": $sinalInv.data('desc'),
      "infoadd": $sinalInv.data('infoadd'),
      "url": $sinalInv.data('url'),
      "tema": $sinalInv.data('tema'),
      "tag1": $sinalInv.data('tag1'),
      "tag2": $sinalInv.data('tag2'),
      "iniciativa": $sinalInv.data('iniciativa'),
      "bibliografia": $sinalInv.data('bibliografia'),
      "produto": $sinalInv.data('produto'),
      "fase": $sinalInv.data('fase'),
      "pais": $sinalInv.data('pais'),
      "cidade": $sinalInv.data('cidade'),
      "fonte": $sinalInv.data('fonte'),
      "evidencias": $sinalInv.data('evidencias')
    };
    incorporarDados(objDados);
    $('.janela-save').addClass('ativo');
    $('#janela-mostra-sinais').removeClass('ativo');

  }

  function incorporarDados(objDados) {
    $('#sign_sinalid').val(objDados['sinalid']);
    $('#sign_tweetid').val(objDados['tweetid']);
    $('#sign_nome').val(objDados['nome']);
    $('#sign_conteudo').val(objDados['conteudo']);
    $('#sign_infoadd').val(objDados['infoadd']);
    $('#sign_url').val(objDados['url']);
    $('#sign_tema').val(objDados['tema']);
    $('#sign_iniciativa').val(objDados['iniciativa']);
    $('#sign_bibliografia').val(objDados['bibliografia']);
    $('#sign_produto').val(objDados['produto']);
    $('#sign_fase').val(objDados['fase']);
    $('#sign_pais').val(objDados['pais']);
    $('#sign_cidade').val(objDados['cidade']);
    $('#sign_fonte').val(objDados['fonte']);
    $('#sign_evidencias').val(objDados['evidencias']);
    $('input.input-subtema').prop('checked', false);

    $('#sign_editar').val(true);

    var inp1 = 'input[name="' + objDados['tag1'] + '"]';
    $(inp1).each(function() {
      $(this).prop('checked', true);
    });

    var inp2 = 'input[name="' + objDados['tag2'] + '"]';
    $(inp2).each(function() {
      $(this).prop('checked', true);
    });

  }

  function limparFormulario() {
    $('#sign_editar').val(false);
    $('#sign_sinalid').val('');
    $('#sign_tweetid').val('');
    $('#sign_nome').val('');
    $('#sign_conteudo').val('');
    $('#sign_infoadd').val('');
    $('#sign_url').val('');
    $('#sign_tema').val('');
    $('#sign_iniciativa').val('');
    $('#sign_bibliografia').val('');
    $('#sign_produto').val('');
    $('#sign_fase').val('');
    $('#sign_pais').val('');
    $('#sign_cidade').val('');
    $('#sign_fonte').val('');
    $('#sign_evidencias').val('');
    $('input.input-subtema').prop('checked', false);
  }

  function carregaJson(arguments) {

    entradas = arguments[0][0];

    entradas.forEach(function(d) {
      for (var propriedade in d) {
        if (d.hasOwnProperty(propriedade)) {
          if (d[propriedade] == null) d[propriedade] = "";
        }
      }
    });

    console.log(arguments);
    /*arguments[8][0].nos.forEach(function(d) {
    d.classe = d.classe[0];
    nodemap[d.name] = d;
    });*/
    var dados = {};
    dados.nos = [];

    tema = arguments[1][0].map(function(d) {
      dados.nos.push({
        "name": d.pt_br.trim(),
        "classe": ["tema"]
      });
      return d.pt_br.trim();
    });

    subtema = arguments[2][0].map(function(d) {
      return d.tags.trim()
    });

    //subtema.splice(subtema.indexOf('Innovation'), 1);
    subtema = uniq(subtema);

    subtema.forEach(function(d) {
      dados.nos.push({
        "name": d,
        "classe": ["subtema"]
      });
    })

    iniciativa = arguments[3][0].map(function(d) {
      dados.nos.push({
        "name": d.descricao.trim(),
        "classe": ["iniciativa"]
      });
      return d.descricao.trim()
    });
    arguments[4][0].push({
      descricao: "Aplicativo",
      id: 999
    });

    fase = arguments[4][0].map(function(d) {
      dados.nos.push({
        "name": d.descricao.trim(),
        "classe": ["fase"]
      });
      return d.descricao.trim()
    });

    bibliografia = arguments[5][0].map(function(d) {
      //dados.nos.push({"name": d.descricao.trim(),"classe": ["bibliografia"]});
      return d.descricao.trim()
    });

    //bibliografia.splice(subtema.indexOf('teste'), 1);

    bibliografia.forEach(function(d) {
      dados.nos.push({
        "name": d.trim(),
        "classe": ["bibliografia"]
      });
    })

    evidencias = arguments[6][0].map(function(d) {
      dados.nos.push({
        "name": d.descricao.trim(),
        "classe": ["evidencias"]
      });
      return d.descricao.trim()
    });

    fonte = arguments[7][0].map(function(d) {
      dados.nos.push({
        "name": d.descricao.trim(),
        "classe": ["fonte"]
      });
      return d.descricao.trim()
    });

    pais = arguments[8][0].nos.filter(function(d) {
      return d.classe == "pais"
    }).map(function(d) {
      dados.nos.push({
        "name": d.name,
        "classe": ["pais"]
      });
      return d.name
    });

    cidade = arguments[8][0].nos.filter(function(d) {
      return d.classe == "cidade"
    }).map(function(d) {
      dados.nos.push({
        "name": d.name,
        "classe": ["cidade"]
      });
      return d.name
    });

    dados.nos.push({
      "name": "Protagonista",
      "classe": ["protagonista"]
    });

    /***** FIM DA CRIAÇÃO DE VARIAVEIS ********/

    //qtde-sinais
    if (window.localStorage.getItem("numero_sinais") === null) {
      window.localStorage.setItem("numero_sinais", entradas.length);
      $('#qtde-sinais').text(entradas.length);
    } else {
      $('#qtde-sinais').text(window.localStorage.getItem("numero_sinais"));
    }

    //qtde-tweets
    if (window.localStorage.getItem("numero_tweets") === null) {
      
    } else {
      $('#qtde-tweets').text(window.localStorage.getItem("numero_tweets"));
    }

    //qtde-retweets
    if (window.localStorage.getItem("numero_retweets") === null) {
      
    } else {
      $('#qtde-retweets').text(window.localStorage.getItem("numero_retweets"));
    }


    var csvData = new Array();
      csvData.push('"SINAL - nome","INFORMAÇÕES","LINK REFERÊNCIA","TEMA","SUBTEMA/TAGS1","SUBTEMA/TAGS2","INICIATIVA","PRODUTO","PROTAGONISTA","BIBLIOGRAFIA","EVIDÊNCIAS","FONTE","PAÍS DE ORIGEM","CIDADE DE ORIGEM","LINK VÍDEO","DATA DE INLCUSÃO NO BANCO DE DADOS","is_tweet","id_tweet","info_add"');
      entradas.forEach(function(item, index, array) {
        csvData.push('"' + item.nome + '","' + item.descricao + '","' + item.url + '","' + item.tema + '","' + item.tag1 + '","' + item.tag2 + '","' + item.iniciativa + '","' + item.fase + '","' + (item.protagonista ? "Sim" : "") + '","' + item.bibliografia + '","' + item.evidencias + '","' + item.fonte + '","' + item.pais + '","' + item.cidade + '","' + item.urlvideo + '","' + item.data_criacao + '","' + (item.is_tweet ? "Sim" : "") + '","' + item.id_tweet + '","' + item.info_add + '"');
      });

    // download stuff
    var fileName = "sinais_exportados_a.csv";
    var buffer = csvData.join("\n");
    var blob = new Blob([buffer], {
      "type": "text/csv;charset=utf8;"
    });

    var link = $('.js-exportar-sinais');
    link.attr("href", window.URL.createObjectURL(blob));
    link.attr("download", fileName);

    copia.nos = $.extend(true, [], dados.nos);

    dadosheat.nos = $.extend(true, [], dados.nos);
    dadosheat.nos.forEach(function(d) {
      d.classe = d.classe[0];
      nodemap[d.name] = d;
    });

    dados.nos.forEach(function(d) {
      if (d.classe.indexOf("tema") > -1) {
        //d.classe.push("aberto");
        nodes[d.name] = d;
        linkmap[d.name] = [];
      };
      nodemapforce[d.name] = d;
    });

    linhas = dadosheat.nos.filter(function(d) {
      return d.classe == "subtema"
    });

    colunas = dadosheat.nos.filter(function(d) {
      return (d.classe == "iniciativa") || (d.classe == "fase") || (d.classe == "bibliografia") || (d.classe == "evidencias") // || (d.classe == "pais")
    });

    linhasB = dadosheat.nos.filter(function(d) {
      return d.classe == "tema"
    });

    colunasB = dadosheat.nos.filter(function(d) {
      return (d.classe == "iniciativa") || (d.classe == "fase") || (d.classe == "bibliografia") || (d.classe == "evidencias") // || (d.classe == "pais")
    });

    linhasC = dadosheat.nos.filter(function(d) {
      return d.classe == "subtema"
    });

    colunasC = dadosheat.nos.filter(function(d) {
      return d.classe == "tema"
    });

    colunas.forEach(function(z){
      if (z.classe == "iniciativa") listaini.push(z.name);
      if (z.classe == "fase") listapro.push(z.name);
      if (z.classe == "bibliografia") listabib.push(z.name);
      if (z.classe == "evidencias") listaevi.push(z.name);
    });


    linhas.forEach(function(d) {
      colunas.forEach(function(e) {
        celulas.push({
          "source": d.name,
          "target": e.name,
          "value": 0
        });
      });
    });

    linhasB.forEach(function(d) {
      colunasB.forEach(function(e) {
        celulasB.push({
          "source": d.name,
          "target": e.name,
          "value": 0
        });
      });
    });

    linhasC.forEach(function(d) {
      colunasC.forEach(function(e) {
        celulasC.push({
          "source": d.name,
          "target": e.name,
          "value": 0
        });
      });
    });

    var propDenied = ["tema", "tag1", "tag2", "pais", "nome", "id", "descricao", "url", "produto", "protagonista", "fonte", "cidade", "info_add", "data_criacao", "is_tweet", "id_tweet", "dt_criacao", "url_video"];

    entradas.forEach(function(d) {

      if (d.cidade === "Sâo Paulo") {
        d.cidade = "São Paulo";
      }

      //entradasheat
      for (var propriedade in d) {
        if (d.hasOwnProperty(propriedade) && (propDenied.indexOf(propriedade) < 0)) {
          // checaAdiciona(d.subtemas[0], d[propriedade], celulas);
          // checaAdiciona(d.subtemas[1], d[propriedade], celulas);
          if ((d[propriedade] != "")) {
            if (d.tag1 != "") checaAdiciona(d.tag1, d[propriedade], celulas);
            if (d.tag2 != "") checaAdiciona(d.tag2, d[propriedade], celulas);
          };
        };
      };
      //entradasheatB
      for (var propriedade in d) {
        if (d.hasOwnProperty(propriedade) && (propDenied.indexOf(propriedade) < 0)) {
          if ((d[propriedade] != "")) {
            if (d.tema != "") checaAdiciona(d.tema, d[propriedade], celulasB);
          };
        };
      };
      //entradasheatC
      if (d.tema != "") {
        if (d.tag1 != "") checaAdiciona(d.tag1, d.tema, celulasC);
        if (d.tag2 != "") checaAdiciona(d.tag2, d.tema, celulasC);
      };
      //entradasbrasil
      if ((d.pais === "Brasil") && (d.cidade != "")) {
        checaAdiciona(d.tema, d.cidade, dadosBrasil);
        checaAdiciona("Todos", d.cidade, dadosBrasil);
      };
      //entradasmundo
      if (d.pais != "") {
        checaAdiciona(d.tema, d.pais, dadosMundo);
        checaAdiciona("Todos", d.pais, dadosMundo);
      };

      //entradasforce
      // checaAdiciona(d.tema, d.subtemas[0], linktemas);
      // checaAdiciona(d.tema, d.subtemas[1], linktemas);
      if (d.iniciativa != "") checaAdiciona(d.tema, d.iniciativa, linktemas);
      if (d.fase != "") checaAdiciona(d.tema, d.fase, linktemas);
      if (d.bibliografia != "") checaAdiciona(d.tema, d.bibliografia, linktemas);
      if (d.evidencias != "") checaAdiciona(d.tema, d.evidencias, linktemas);
      if (d.pais != "") checaAdiciona(d.tema, d.pais, linktemas);
      if (d.protagonista == 1) checaAdiciona(d.tema, "Protagonista", linktemas);
      checaAdiciona(d.tema, d.nome, linknomes);
      // checaAdiciona(d.subtemas[0], d.nome, linknomes);
      // checaAdiciona(d.subtemas[1], d.nome, linknomes);
      if (d.iniciativa != "") checaAdiciona(d.iniciativa, d.nome, linknomes);
      if (d.fase != "") checaAdiciona(d.fase, d.nome, linknomes);
      if (d.bibliografia != "") checaAdiciona(d.bibliografia, d.nome, linknomes);
      if (d.evidencias != "") checaAdiciona(d.evidencias, d.nome, linknomes);
      if (d.pais != "") checaAdiciona(d.pais, d.nome, linknomes);
      if (d.protagonista == 1) checaAdiciona("Protagonista", d.nome, linknomes);
      if (d.tag1 != "") {
        checaAdiciona(d.tema, d.tag1, linktemas);
        checaAdiciona(d.tag1, d.nome, linknomes);
      }
      if (d.tag2 != "") {
        checaAdiciona(d.tema, d.tag2, linktemas);
        checaAdiciona(d.tag2, d.nome, linknomes);
      }
    });

    temasBrasil = dadosBrasil.map(function(d) {
      return d.source
    }).filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });
    temasBrasil.splice(temasBrasil.indexOf("Todos"), 1);
    temasBrasil.push("Todos");

    temasMundo = dadosMundo.map(function(d) {
      return d.source
    }).filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });
    temasMundo.splice(temasMundo.indexOf("Todos"), 1);
    temasMundo.push("Todos");

    celulas.forEach(function(d) {
      d.col = linhas.indexOf(nodemap[d.source]);
      d.row = colunas.indexOf(nodemap[d.target]);
    });

    celulasB.forEach(function(d) {
      d.col = linhasB.indexOf(nodemap[d.source]);
      d.row = colunasB.indexOf(nodemap[d.target]);
    });

    celulasC.forEach(function(d) {
      d.col = linhasC.indexOf(nodemap[d.source]);
      d.row = colunasC.indexOf(nodemap[d.target]);
    });

    copia.links = $.extend(true, [], linktemas);

    linktemas.forEach(function(d) {

      // if (!linkmap[d.source]) {
      // }
      // linkmap[d.source].push(d);
    });

    if (QueryString.viz === '1') {
      heatMap();
      $('.titulo-viz').text('Heatmap');
    } else if (QueryString.viz === '3') {
      mapaBrasil();
      $('.titulo-viz').text('Sinais Geolocalizados (Brasil)');
    } else if (QueryString.viz === '2') {
      forceLayout();
      $('.titulo-viz').text('Force-Based Graph');
    } else {
      mapaMundo();
      $('.titulo-viz').text('Sinais Geolocalizados (Mundo)');
      $('#modal-abertura').addClass('md-show');
    }


    carregaFormulario();

  };

  function selecionaViz(event) {
    event.preventDefault();
    var a = $(this).data('alvo');
    var titulo = $(this).data('titulo');
    $('.item-menu').removeClass('ativo');
    $(this).parent().addClass('ativo');
    $('.titulo-viz').html(titulo);
    $('.container-menu-nav').removeClass('ativo');
    return a == 1 ? heatMapC() : a == 2 ? forceLayout() : a == 3 ? mapaBrasil() : mapaMundo();
  }

  function carregaFormulario() {

    $.each(tema, function(i, d) {
      $('#sign_tema').append($('<option></option>').val(d).html(d));
    });

    $.each(iniciativa, function(i, d) {
      $('#sign_iniciativa').append($('<option></option>').val(d).html(d));
    });

    $.each(bibliografia, function(i, d) {
      $('#sign_bibliografia').append($('<option></option>').val(d).html(d));
    });

    $.each(fase, function(i, d) {
      $('#sign_fase').append($('<option></option>').val(d).html(d));
    });

    $.each(pais, function(i, d) {
      $('#sign_pais').append($('<option></option>').val(d).html(d));
    });

    $.each(cidade, function(i, d) {
      $('#sign_cidade').append($('<option></option>').val(d).html(d))
    });

    $.each(fonte, function(i, d) {
      $('#sign_fonte').append($('<option></option>').val(d).html(d));
    });

    $.each(evidencias, function(i, d) {
      $('#sign_evidencias').append($('<option></option>').val(d).html(d));
    });

    $.each(subtema, function(i, d) {

      var $div = $('<div></div>');
      $('<input type="checkbox" class="input-subtema" name="' + d + '" id="subtema' + i + '" >').val(d).appendTo($div);
      $('<label class="check" for="subtema' + i + '"></label>').html(d).appendTo($div);
      $('.colunas-subtemas').append($div);

    });

    $('.habilita-subtema, .close-subtema').on('click', function(event) {
      event.preventDefault();
      $('.lista-subtemas').toggleClass('ativo');
    });

    var listaFiltroTema = entradas.map(function(d) {
      return d.tema;
    }).filter(function(item, pos, self) { //<-remove duplicadas
      return self.indexOf(item) == pos;
    }).sort();

    var listaFiltroSubtema = entradas.map(function(d) {
      return d.tag1, d.tag2;
    }).clean().filter(function(item, pos, self) { //<-remove duplicadas
      return self.indexOf(item) == pos;
    }).sort();

    var listaFiltroIniciativa = entradas.map(function(d) {
      return d.iniciativa;
    }).clean("").filter(function(item, pos, self) { //<-remove duplicadas
      return self.indexOf(item) == pos;
    }).sort();

    var listaFiltroBibliografia = entradas.map(function(d) {
      return d.bibliografia;
    }).clean("").filter(function(item, pos, self) { //<-remove duplicadas
      return self.indexOf(item) == pos;
    }).sort();

    var listaFiltroFase = entradas.map(function(d) {
      return d.fase;
    }).filter(function(item, pos, self) { //<-remove duplicadas
      return self.indexOf(item) == pos;
    }).sort().clean("");

    var listaFiltroPais = entradas.map(function(d) {
      return d.pais;
    }).clean("").filter(function(item, pos, self) { //<-remove duplicadas
      return self.indexOf(item) == pos;
    }).sort();

    var listaFiltroEvidencias = entradas.map(function(d) {
      return d.evidencias;
    }).clean("").filter(function(item, pos, self) { //<-remove duplicadas
      return self.indexOf(item) == pos;
    }).sort();

    $.each(listaFiltroTema, function(i, d) {
      $('#filtro_tema').append($('<option></option>').val(d).html(d));
    });

    $.each(listaFiltroSubtema, function(i, d) {
      $('#filtro_subtema').append($('<option></option>').val(d).html(d));
    });

    $.each(listaFiltroIniciativa, function(i, d) {
      $('#filtro_iniciativa').append($('<option></option>').val(d).html(d));
    });

    $.each(listaFiltroBibliografia, function(i, d) {
      $('#filtro_bibliografia').append($('<option></option>').val(d).html(d));
    });

    $.each(listaFiltroFase, function(i, d) {
      $('#filtro_fase').append($('<option></option>').val(d).html(d));
    });

    $.each(listaFiltroPais, function(i, d) {
      $('#filtro_pais').append($('<option></option>').val(d).html(d))
    });

    $.each(listaFiltroEvidencias, function(i, d) {
      $('#filtro_evidencias').append($('<option></option>').val(d).html(d));
    });


  }



  function forceLayout() {
    $('#regions_div,#heatmap,#grafo,#items').empty();
    $('#regions_div,#heatmap,#grafo,#items').off();
    $("#items").css("display", "none");
    $("#items").off();
    $(".zoom_in, .zoom_out").off();

    $('#grafo').addClass('ativo');
    $('#regions_div, #heatmap').removeClass('ativo');

    $('.visu-controles-mapas, .visu-controles-heatmap').removeClass('ativo');
    $('.visu-controles-force, .legenda-bloco, .abre-filtros, .zoom').addClass('ativo');
    $('.force-node-texto').removeClass('ativo');

    var width = wTela,
      height = hTela;

    var color = d3.scale.category20();

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-50, 0])
      .html(function(z) {
        return z.name;
      });

    var zoom = d3.behavior.zoom()
      .scaleExtent([.5, 10])
      .on("zoom", zoomed);

    var drag = d3.behavior.drag()
      .origin(function(d) {
        return d;
      })
      .on("dragstart", dragstarted)
      .on("drag", dragged)
      .on("dragend", dragended);

    var force = d3.layout.force()
      .size([width, height])
      .linkDistance(135
        /*function(d) {
        return ((nodemap[d.target.name]) ? 120 : 150) //(Math.sqrt(d.value) * 50)
      }*/
      )
      .charge(-450
        /*function(d) {
        return ((d.classe[0] == "nome") || (d.classe[0] == "tema")) ? -600 : -300
      }*/
      )
      .gravity(.05)
      .friction(0.5)
      .theta(1)
      .on("tick", tick);


    var svg = d3.select("#grafo").append("svg")
      .attr("width", width)
      .attr("height", height)
      //.style("border", "1px solid black");

    var container = svg.append("g");

    var path = container.append("g").selectAll("path"),
      circle = container.append("g").selectAll("circle");

    svg.call(tip)
      .call(zoom);

    update();
    classesEscondidas = [];
    $('.filtro-legenda').each(function() {
      if ($(this).hasClass('ativo')) {
        var thisTipo = $(this).data('tipo');
        classesEscondidas.push(thisTipo);
      };
    });

    d3.selectAll('#zoom_in').on('click', function() {
      var newScale = zoom.scale() * 2;
      if (newScale >= zoom.scaleExtent()[1]) newScale = zoom.scaleExtent()[1];
      var newX = (zoom.translate()[0] - width / 2) * (newScale / zoom.scale()) + width / 2;
      var newY = (zoom.translate()[1] - height / 2) * newScale / zoom.scale() + height / 2;

      zoom
        .scale(newScale)
        .translate([newX, newY])
        .event(container.transition(800));

    });

    d3.selectAll('#zoom_out').on('click', function() {
      var newScale = zoom.scale() * .5;
      if (newScale <= zoom.scaleExtent()[0]) newScale = zoom.scaleExtent()[0];
      var newX = (zoom.translate()[0] - width / 2) * newScale / zoom.scale() + width / 2;
      var newY = (zoom.translate()[1] - height / 2) * newScale / zoom.scale() + height / 2;

      zoom
        .scale(newScale)
        .translate([newX, newY])
        .event(container.transition(800));

    });

    vizinhoLegenda(classesEscondidas);

    function update() {
      var escala = d3.scale.pow().exponent(1.1).domain([0, (copia.links.concat(linknomes)).reduce(function(a, b) {
        return Math.max(a, b.value)
      }, 0) * 2]).range([8, 14]);
      var escala2 = d3.scale.linear().domain([0, (copia.links.concat(linknomes)).reduce(function(a, b) {
        return Math.max(a, b.value)
      }, 0) * 10]).range([3, 8]);
      var escalalinks = d3.scale.linear().domain([0, (copia.links.concat(linknomes)).reduce(function(a, b) {
        return Math.max(a, b.value)
      }, 0)]).range([0.1, 2]);

      d3.selectAll("circle,path").classed("escondido", false);
      d3.selectAll("circle,path").classed("escondidoDeFato", false);
      /*var lista = $.extend(true, [], linknomes);
      d3.selectAll(".aberto").each(function(d) {
        lista = lista.concat(linkmap[d.name]);
      });*/
      var links = $.extend(true, [], linktemas.concat(linknomes));

      d3.selectAll("circle").each(function(d) {
        if (d3.select(this).attr("class")) d.classe = d3.select(this).attr("class").split(" ")
      }); //backup das classes

      d3.values(nodes).forEach(function(aNode) {
        aNode.linkCount = 0;
      });
      var listanomes = entradas.map(function(k) {
        return k.nome
      });

      links.forEach(function(link) {
        // if ( !nodemapforce[link.source] && (listanomes.indexOf(link.source) < 0) ) console.log(link.source);
        // if (!nodemapforce[link.target] && (listanomes.indexOf(link.target) < 0) ) console.log(link.target);
        link.source = nodes[link.source] || (nodes[link.source] = {
          name: link.source,
          linkCount: 0,
          classe: ((nodemapforce[link.source]) ? nodemapforce[link.source].classe : (listanomes.indexOf(link.source) > -1) ? ["nome"] : ["pais"])
        });
        link.source.linkCount++;
        link.target = nodes[link.target] || (nodes[link.target] = {
          name: link.target,
          linkCount: 0,
          classe: ((nodemapforce[link.target]) ? nodemapforce[link.target].classe : (listanomes.indexOf(link.target) > -1) ? ["nome"] : ["pais"])
        });
        link.target.linkCount++;
      });

      d3.keys(nodes).forEach(

        function(nodeKey) {
          if (!nodes[nodeKey].linkCount) {
            delete(nodes[nodeKey]);
          }
        });
      force.nodes(d3.values(nodes))
        .links(links)
        .start();

      globLinks = $.extend(true, [], links);

      path = path.data(force.links());
      path.enter().append("path");
      path.exit().remove();
      path.attr("class", function(d) {
        return "link";
      })
        .style("stroke-width", function(d) {
          d.grossura = escalalinks(d.value);
          return escalalinks(d.value);
        });


      circle = circle.data(force.nodes());
      circle.enter().append("circle");
      circle.exit().remove();
      circle.attr("class", function(d) {
        if (d.classe) return d.classe.join(" ")
      })
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        })
        .attr("r", function(d) {
          var raiosomado = escala(links.filter(function(z) {
            return (z.source.name == d.name) || (z.target.name == d.name)
          }).reduce(function(a, b) {
            return a + b.value
          }, 0));
          if (d3.select(this).classed("batata")) {
            //d.raiocalc = Math.sqrt(raiosomado) * 2;
            return Math.sqrt(raiosomado) * 2;
          } else {
            d.raiocalc = raiosomado;
            return raiosomado;
          }
        })
        .on('click', function(d) {
          if (d3.event.defaultPrevented) return;
          if (d3.selectAll(".escondido")[0].length) {
            d3.selectAll("circle,path").classed("escondido", false);
            d3.selectAll("circle,path").classed("escondidoDeFato", false);
            nomeSelecionadas = null;
            $('.force-node-texto').removeClass('ativo');

          } else {
            vizinho(d.name, links);
            nomeSelecionadas = d.name;
            var listinha = entradas.filter(function(e) {
              if (d.classe[0] === "subtema") return ((e.tag1 == d.name) || (e.tag2 == d.name))
              else return e[d.classe[0]] === d.name;
            });
            $('#nome-node').html(d.name);
            armazenaLista = listinha;
            $('.force-node-texto').addClass('ativo');

          }
        })
        .on('mouseover', function(d) {
          tip.show(d);
        })
        .on('mouseout', function(d) {
          tip.hide(d);
        })
        .call(drag);

    }

    function tick() {
      path.attr("d", linkArc);
      circle.attr("cx", function(d) {
        return d.x;
      })
        .attr("cy", function(d) {
          return d.y;
        });
    }

    function linkArc(d) {
      var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }

    function listaLinks() {
      var lista = [];
      d3.selectAll(".aberto").each(function(d, i) {
        lista = lista.concat(d.links);
      });
      return lista
    }



    function zoomed() {
      var s = d3.event.scale;
      container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      d3.selectAll("circle").attr("r", function(d) {;
        return d.raiocalc / Math.sqrt(s);
      })
      d3.selectAll("path").style("stroke-width", function(d) {;
        return d.grossura / s;
      })
    }

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();

      d3.select(this).classed("dragging", true);
      force.start();
    }

    function dragged(d) {

      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

    }

    function dragended(d) {

      d3.select(this).classed("dragging", false);
    }

  }

  function mapaBrasil() {

    $('#regions_div,#heatmap,#grafo,#items').empty();
    $('#regions_div,#heatmap,#grafo,#items').off();
    $("#items").css("display", "block");
    //$("#items").off();

    $('#regions_div').addClass('ativo');
    $('#heatmap, #grafo').removeClass('ativo');

    $('.instru-topo').html('Mostrando sinais com o tema: ');
    $('.instru-bottom').html('Clique em uma cidade para visualizar os sinais encontrados: ');
    $('.visu-controles-mapas, .voltar-mundo, .ver-abrangencia').addClass('ativo');

    $('.visu-controles-heatmap, .visu-controles-force, .legenda-bloco').removeClass('ativo');
    $('.force-node-texto, .abre-filtros, .zoom').removeClass('ativo');

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    var options = {
      region: 'BR',
      displayMode: 'markers',
      backgroundColor: corFundoMapa,
      colorAxis: {
        colors: [corAzulClaro, corAzul]
      }
    };


    $.each(temasBrasil, function(i, d) {
      $('#items').append($('<option></option>').val(d).html(d))
    });

    $("#items").change(function() {
      chart.clearChart();
      chart.draw(google.visualization.arrayToDataTable(pontosBrasil[$("#items").val()]), options);
    });

    $('#items').val('Todos');

    temasBrasil.forEach(function(d) {
      pontosBrasil[d] = [
        ['City', 'Ocorrências']
      ]
      dadosBrasil.filter(function(e) {
        return e.source == d
      }).forEach(function(e) {
        pontosBrasil[d].push([e.target, e.value])
      });
    });


    google.visualization.events.addListener(chart, 'select', function() {
      var alvo = chart.getSelection()[0];
      if (alvo) {
        var tabela = google.visualization.arrayToDataTable(pontosBrasil[$("#items").val()]);
        var city = tabela.getValue(alvo.row, 0);
        var temaAtual = $("#items").val();

        if (temaAtual === "Todos") {
          var listinha = entradas.filter(function(d) {
            return (d.cidade === city)
          });
        } else {
          var listinha = entradas.filter(function(d) {
            return ((d.cidade === city) && (d.tema === temaAtual))
          });
        }

        if (listinha.length > 0) {
          mostraSinais(listinha);
        };
      }
    });

    chart.draw(google.visualization.arrayToDataTable(pontosBrasil[$("#items").val()]), options);
  }

  function mapaMundo() {

    $('#regions_div,#heatmap,#grafo,#items').empty();
    $('#regions_div,#heatmap,#grafo,#items').off();
    $("#items").css("display", "block");
    //$("#items").off();

    $('#regions_div').addClass('ativo');
    $('#heatmap, #grafo').removeClass('ativo');

    $('.instru-topo').html('Mostrando sinais com o tema: ');
    $('.instru-bottom').html('Clique em um país para visualizar os sinais encontrados: ');

    $('.visu-controles-mapas').addClass('ativo');
    $('.visu-controles-heatmap, .visu-controles-force, .legenda-bloco, .voltar-mundo, .ver-abrangencia').removeClass('ativo');
    $('.force-node-texto, .abre-filtros, .zoom').removeClass('ativo');

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    var options = {
      backgroundColor: corFundoMapa,
      colorAxis: {
        colors: [corAzulClaro, corAzul]
      }
    };

    $.each(temasMundo, function(i, d) {
      $('#items').append($('<option></option>').val(d).html(d))
    });

    $("#items").change(function() {
      chart.clearChart();
      chart.draw(google.visualization.arrayToDataTable(pontosMundo[$("#items").val()]), options);
    });

    $('#items').val('Todos');

    temasMundo.forEach(function(d) {
      pontosMundo[d] = [
        ['Country', 'Ocorrências']
      ]
      dadosMundo.filter(function(e) {
        return e.source == d
      }).forEach(function(e) {
        pontosMundo[d].push([e.target, e.value])
      });
    });


    google.visualization.events.addListener(chart, 'select', function() {
      var alvo = chart.getSelection()[0];
      if (alvo) {
        var tabela = google.visualization.arrayToDataTable(pontosMundo[$("#items").val()]);
        var country = tabela.getValue(alvo.row, 0);
        if (country === "Brasil") {
          mapaBrasil();
          return;
        };
        var temaAtual = $("#items").val();

        if (temaAtual === "Todos") {
          var listinha = entradas.filter(function(d) {
            return (d.pais === country)
          });
        } else {
          var listinha = entradas.filter(function(d) {
            return ((d.pais === country) && (d.tema === temaAtual))
          });
        }

        if (listinha.length > 0) {
          mostraSinais(listinha);
        };
      }
    });

    chart.draw(google.visualization.arrayToDataTable(pontosMundo[$("#items").val()]), options);


  };


  function heatMap() {
    $('#regions_div,#heatmap,#grafo,#items').empty();
    $('#regions_div,#heatmap,#grafo,#items').off();
    $("#items").css("display", "block");
    //$("#items").off();

    $('#heatmap').addClass('ativo');
    $('#regions_div, #grafo').removeClass('ativo');

    $('.visu-controles-mapas, .visu-controles-force, .legenda-bloco').removeClass('ativo');
    $('.visu-controles-heatmap').addClass('ativo');
    $('.force-node-texto, .abre-filtros, .zoom').removeClass('ativo');

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(z) {
        return z.source + " : " + z.target + " = " + z.value;
      });

    var escalavermelho = d3.scale.linear().domain([0, celulas.reduce(function(a, b) {
      return Math.max(a, b.value)
    }, 0)]).range([corFundo, corAzul]);

    var gridSize = 25,
      h = gridSize,
      w = gridSize * .70,
      rectPadding = 30;

    var colorLow = 'white',
      colorMed = 'yellow',
      colorHigh = 'red';

    var margin = {
        top: 200,
        right: 80,
        bottom: 20,
        left: 180
      },
      width = wTela - margin.left - margin.right,
      height = hTela - margin.top - margin.bottom;

    var colorScale = d3.scale.linear()
      .domain([0, 1])
      .range([colorLow, colorHigh]);

    var svg = d3.select("#heatmap").append("svg")
      .attr("width", width + margin.left + margin.right + 300 )
      .attr("height", height + margin.top + margin.bottom + 300)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var heatMap = svg.selectAll(".heatmap")
      .data(celulas, function(d) {
        return d.col + ':' + d.row;
      })
      .enter().append("svg:rect")
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
      })
      .attr("class", function(d) {
        return "cell c" + d.col + " r" + d.row;
      })
      .style("fill", function(d) {
        if (d.value > 0) {

        }
        return escalavermelho(d.value);
      })
      .on('mouseover', function(d) {
        //tip.show(d);
        d3.selectAll(".c" + d.col + ",.r" + d.row + ",.cL" + d.col + ",.rL" + d.row).classed("highlighted", true);
      })
      .on('mouseout', function(d) {
        //tip.hide(d);
        d3.selectAll(".c" + d.col + ",.r" + d.row + ",.cL" + d.col + ",.rL" + d.row).classed("highlighted", false);
      }).on('click', function(d) {
        var listinha = entradas.filter(function(e) {
          return ((e.fase === d.target) && ((e.tag1 == d.source) || (e.tag2 == d.source))) || ((e.iniciativa === d.target) && ((e.tag1 == d.source) || (e.tag2 == d.source))) || ((e.bibliografia === d.target) && ((e.tag1 == d.source) || (e.tag2 == d.source))) || ((e.evidencias === d.target) && ((e.tag1 == d.source) || (e.tag2 == d.source)))
        });
        if (listinha.length > 0) {
          mostraSinais(listinha);
        };
      });

    var rowLabels = svg.append("g")
      .selectAll(".row.label")
      .data(colunas)
      .enter()
      .append("text")
      .text(function(d) {
        return d.name;
      })
      .attr("x", 0)
      .attr("y", function(d) {
        return colunas.indexOf(nodemap[d.name]) * h;
      })
      .attr("class", function(d) {
        return "row label rL" + colunas.indexOf(nodemap[d.name]);
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + h / 1.5 + ")")
      .on('click', function(d) {
        var ordem = celulas.filter(function(e) {
          return e.target == d.name
        }).sort(function(a, b) {
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        });
        var ordemMapa = [];
        ordem.forEach(function(f) {
          ordemMapa.push(nodemap[f.source]);
        });
        var t = svg.transition().duration(3000);
        t.selectAll(".cell").attr("x", function(g) {
          return ordemMapa.indexOf(nodemap[g.source]) * w;
        });
        t.selectAll(".col").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.name]) * w;
        });
      });

    var colLabels = svg.append("g")
      .selectAll(".col.label")
      .data(linhas)
      .enter()
      .append("text")
      .text(function(d) {
        return d.name;
      })
      .attr("x", 0)
      .attr("y", function(d) {
        //d.col=colunas.indexOf(nodemap[d.name]);
        return linhas.indexOf(nodemap[d.name]) * w;
      })
      .attr("class", function(d) {
        return "col label cL" + linhas.indexOf(nodemap[d.name]);
      })
      .style("text-anchor", "left")
      .attr("transform", "translate(" + w / 2 + ",-6) rotate (-90)")
      .on('click', function(d) {
        var ordem = celulas.filter(function(e) {
          return e.source == d.name
        }).sort(function(a, b) {
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        });
        var ordemMapa = [];
        ordem.forEach(function(f) {
          ordemMapa.push(nodemap[f.target]);
        });
        //d.col=ordemMapa.indexOf(nodemap[d.name]);
        var t = svg.transition().duration(3000);
        t.selectAll(".cell").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.target]) * h;
        });
        t.selectAll(".row").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.name]) * h;
        });
      });
    /*        .on('mouseover', function(d) {
          if (d3.event.defaultPrevented) return;
          //tip.show(d);
          d3.selectAll(".c"+d.col+",.cL"+d.col).classed("highlighted", true);
        })
        .on('mouseout', function(d) {
          if (d3.event.defaultPrevented) return;
          //tip.hide(d);
          d3.selectAll(".c"+d.col+",.cL"+d.col).classed("highlighted", false);
        });*/

      //mudacorlabel
      d3.selectAll(".label").each(function(z){
        if (listaini.indexOf(z.name)>-1) d3.select(this).style("fill","#7d7d7d");
        if (listapro.indexOf(z.name)>-1) d3.select(this).style("fill","#8e298e");
        if (listaevi.indexOf(z.name)>-1) d3.select(this).style("fill","#c2a105");
        if (listabib.indexOf(z.name)>-1) d3.select(this).style("fill","#f16638");
      })
  };

  function heatMapB() {
    $('#regions_div,#heatmap,#grafo,#items').empty();
    $('#regions_div,#heatmap,#grafo,#items').off();
    $("#items").css("display", "block");
    //$("#items").off();

    $('#heatmap').addClass('ativo');
    $('#regions_div, #grafo').removeClass('ativo');

    $('.visu-controles-mapas, .visu-controles-force, .legenda-bloco').removeClass('ativo');
    $('.visu-controles-heatmap').addClass('ativo');
    $('.force-node-texto, .abre-filtros, .zoom').removeClass('ativo');

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(z) {
        return z.source + " : " + z.target + " = " + z.value;
      });

    var escalavermelho = d3.scale.linear().domain([0, celulasB.reduce(function(a, b) {
      return Math.max(a, b.value)
    }, 0)]).range([corFundo, corAzul]);

    var gridSize = 25,
      h = gridSize,
      w = gridSize,
      rectPadding = 30;

    var colorLow = 'white',
      colorMed = 'yellow',
      colorHigh = 'red';

    var margin = {
        top: 200,
        right: 80,
        bottom: 20,
        left: 200
      },
      width = wTela - margin.left - margin.right,
      height = hTela - margin.top - margin.bottom;

    var colorScale = d3.scale.linear()
      .domain([0, 1])
      .range([colorLow, colorHigh]);

    var svg = d3.select("#heatmap").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var heatMap = svg.selectAll(".heatmap")
      .data(celulasB, function(d) {
        return d.col + ':' + d.row;
      })
      .enter().append("svg:rect")
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
      })
      .attr("class", function(d) {
        return "cell c" + d.col + " r" + d.row;
      })
      .style("fill", function(d) {
        if (d.value > 0) {

        }
        return escalavermelho(d.value);
      })
      .on('mouseover', function(d) {
        //tip.show(d);
        d3.selectAll(".c" + d.col + ",.r" + d.row + ",.cL" + d.col + ",.rL" + d.row).classed("highlighted", true);
      })
      .on('mouseout', function(d) {
        //tip.hide(d);
        d3.selectAll(".c" + d.col + ",.r" + d.row + ",.cL" + d.col + ",.rL" + d.row).classed("highlighted", false);
      }).on('click', function(d) {
        var listinha = entradas.filter(function(e) {
          return ((e.fase === d.target) && (e.tema == d.source)) || ((e.iniciativa === d.target) && (e.tema == d.source)) || ((e.bibliografia === d.target) && (e.tema == d.source)) || ((e.evidencias === d.target) && (e.tema == d.source))
        });
        if (listinha.length > 0) {
          mostraSinais(listinha);
        };
      });

    var rowLabels = svg.append("g")
      .selectAll(".row.label")
      .data(colunasB)
      .enter()
      .append("text")
      .text(function(d) {
        return d.name;
      })
      .attr("x", 0)
      .attr("y", function(d) {
        return colunasB.indexOf(nodemap[d.name]) * h;
      })
      .attr("class", function(d) {
        return "row label rL" + colunasB.indexOf(nodemap[d.name]);
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + h / 1.5 + ")")
      .on('click', function(d) {
        var ordem = celulasB.filter(function(e) {
          return e.target == d.name
        }).sort(function(a, b) {
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        });
        var ordemMapa = [];
        ordem.forEach(function(f) {
          ordemMapa.push(nodemap[f.source]);
        });
        var t = svg.transition().duration(3000);
        t.selectAll(".cell").attr("x", function(g) {
          return ordemMapa.indexOf(nodemap[g.source]) * w;
        });
        t.selectAll(".col").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.name]) * w;
        });
      });

    var colLabels = svg.append("g")
      .selectAll(".col.label")
      .data(linhasB)
      .enter()
      .append("text")
      .text(function(d) {
        var tnome = d.name;
        if(tnome.length > 24) tnome = tnome.substring(0,24) + '...';
        return tnome;
      })
      .attr("x", 0)
      .attr("y", function(d) {
        //d.col=colunas.indexOf(nodemap[d.name]);
        return linhasB.indexOf(nodemap[d.name]) * w;
      })
      .attr("class", function(d) {
        return "col label cL" + linhasB.indexOf(nodemap[d.name]);
      })
      .style("text-anchor", "left")
      .attr("transform", "translate(" + w / 2 + ",-6) rotate (-90)")
      .on('click', function(d) {
        var ordem = celulasB.filter(function(e) {
          return e.source == d.name
        }).sort(function(a, b) {
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        });
        var ordemMapa = [];
        ordem.forEach(function(f) {
          ordemMapa.push(nodemap[f.target]);
        });
        //d.col=ordemMapa.indexOf(nodemap[d.name]);
        var t = svg.transition().duration(3000);
        t.selectAll(".cell").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.target]) * h;
        });
        t.selectAll(".row").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.name]) * h;
        });
      });

      //mudacorlabel
      d3.selectAll(".label").each(function(z){
        if (listaini.indexOf(z.name)>-1) d3.select(this).style("fill","#7d7d7d");
        if (listapro.indexOf(z.name)>-1) d3.select(this).style("fill","#8e298e");
        if (listaevi.indexOf(z.name)>-1) d3.select(this).style("fill","#c2a105");
        if (listabib.indexOf(z.name)>-1) d3.select(this).style("fill","#f16638");
      })
  };

  function heatMapC() {
    $('#regions_div,#heatmap,#grafo,#items').empty();
    $('#regions_div,#heatmap,#grafo,#items').off();
    $("#items").css("display", "block");
    //$("#items").off();

    $('#heatmap').addClass('ativo');
    $('#regions_div, #grafo').removeClass('ativo');

    $('.visu-controles-mapas, .visu-controles-force, .legenda-bloco').removeClass('ativo');
    $('.visu-controles-heatmap').addClass('ativo');
    $('.force-node-texto, .abre-filtros, .zoom').removeClass('ativo');

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(z) {
        return z.source + " : " + z.target + " = " + z.value;
      });

    var escalavermelho = d3.scale.linear().domain([0, celulasC.reduce(function(a, b) {
      return Math.max(a, b.value)
    }, 0)]).range([corFundo, corAzul]);

    var gridSize = 25,
      h = gridSize,
      w = gridSize * .70,
      rectPadding = 30;

    var colorLow = 'white',
      colorMed = 'yellow',
      colorHigh = 'red';

    var margin = {
        top: 200,
        right: 80,
        bottom: 20,
        left: 200
      },
      width = wTela - margin.left - margin.right,
      height = hTela - margin.top - margin.bottom;

    var colorScale = d3.scale.linear()
      .domain([0, 1])
      .range([colorLow, colorHigh]);

    var svg = d3.select("#heatmap").append("svg")
      .attr("width", width + margin.left + margin.right + 300)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var heatMap = svg.selectAll(".heatmap")
      .data(celulasC, function(d) {
        return d.col + ':' + d.row;
      })
      .enter().append("svg:rect")
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
      })
      .attr("class", function(d) {
        return "cell c" + d.col + " r" + d.row;
      })
      .style("fill", function(d) {
        if (d.value > 0) {

        }
        return escalavermelho(d.value);
      })
      .on('mouseover', function(d) {
        //tip.show(d);
        d3.selectAll(".c" + d.col + ",.r" + d.row + ",.cL" + d.col + ",.rL" + d.row).classed("highlighted", true);
      })
      .on('mouseout', function(d) {
        //tip.hide(d);
        d3.selectAll(".c" + d.col + ",.r" + d.row + ",.cL" + d.col + ",.rL" + d.row).classed("highlighted", false);
      }).on('click', function(d) {
        var listinha = entradas.filter(function(e) {
          return ((e.tema === d.target) && ((e.tag1 == d.source) || (e.tag2 == d.source)))
        });
        if (listinha.length > 0) {
          mostraSinais(listinha);
        };
      });

    var rowLabels = svg.append("g")
      .selectAll(".row.label")
      .data(colunasC)
      .enter()
      .append("text")
      .text(function(d) {
        var tnome = d.name;
        if(tnome.length > 24) tnome = tnome.substring(0,24) + '...';
        return tnome;
      })
      .attr("x", 0)
      .attr("y", function(d) {
        return colunasC.indexOf(nodemap[d.name]) * h;
      })
      .attr("class", function(d) {
        return "row label rL" + colunasC.indexOf(nodemap[d.name]);
      })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + h / 1.5 + ")")
      .on('click', function(d) {
        var ordem = celulasC.filter(function(e) {
          return e.target == d.name
        }).sort(function(a, b) {
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        });
        var ordemMapa = [];
        ordem.forEach(function(f) {
          ordemMapa.push(nodemap[f.source]);
        });
        var t = svg.transition().duration(3000);
        t.selectAll(".cell").attr("x", function(g) {
          return ordemMapa.indexOf(nodemap[g.source]) * w;
        });
        t.selectAll(".col").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.name]) * w;
        });
      });

    var colLabels = svg.append("g")
      .selectAll(".col.label")
      .data(linhasC)
      .enter()
      .append("text")
      .text(function(d) {
        return d.name;
      })
      .attr("x", 0)
      .attr("y", function(d) {
        //d.col=colunas.indexOf(nodemap[d.name]);
        return linhasC.indexOf(nodemap[d.name]) * w;
      })
      .attr("class", function(d) {
        return "col label cL" + linhasC.indexOf(nodemap[d.name]);
      })
      .style("text-anchor", "left")
      .attr("transform", "translate(" + w / 2 + ",-6) rotate (-90)")
      .on('click', function(d) {
        var ordem = celulasC.filter(function(e) {
          return e.source == d.name
        }).sort(function(a, b) {
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        });
        var ordemMapa = [];
        ordem.forEach(function(f) {
          ordemMapa.push(nodemap[f.target]);
        });
        //d.col=ordemMapa.indexOf(nodemap[d.name]);
        var t = svg.transition().duration(3000);
        t.selectAll(".cell").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.target]) * h;
        });
        t.selectAll(".row").attr("y", function(g) {
          return ordemMapa.indexOf(nodemap[g.name]) * h;
        });
      });
  };

  $('#alterna-heatmap1').on('click', function(e){
    e.preventDefault();
    $('.alterna-heatmap').removeClass('ativo');
    $(this).addClass('ativo');
    heatMap();
  })

  $('#alterna-heatmap2').on('click', function(e){
    e.preventDefault();
    $('.alterna-heatmap').removeClass('ativo');
    $(this).addClass('ativo');
    heatMapB();
  })

  $('#alterna-heatmap3').on('click', function(e){
    e.preventDefault();
    $('.alterna-heatmap').removeClass('ativo');
    $(this).addClass('ativo');
    heatMapC();
  })

  function checaAdiciona(fonte, alvo, lista) {
    var busca = lista.filter(function(z) {
      return (z.source == fonte) && (z.target == alvo);
    });
    if (busca.length > 0) lista[lista.indexOf(busca[0])].value++;
    else lista.push({
      "source": fonte,
      "target": alvo,
      "value": 1
    });
  };

  function vizinho(nome, lista) {
    var busca = lista.filter(function(z) {
      return (z.source.name == nome) || (z.target.name == nome);
    });

    var classesVisiveis = [];
    $('.filtro-legenda').each(function() {
      if ($(this).hasClass('ativo')) {
        var thisTipo = $(this).data('tipo');
        classesVisiveis.push(thisTipo);
      };
    });

    var buscados = []
    if (busca.length > 0) {
      busca.forEach(function(y) {
        if (classesVisiveis.indexOf(y.source.classe[0]) > -1) buscados.push(y.source.name);
        if (classesVisiveis.indexOf(y.target.classe[0]) > -1) buscados.push(y.target.name);
      })
    };
    d3.selectAll("circle").each(function(x) {
      if ((buscados.indexOf(x.name) < 0) && (x.name != nome)) d3.select(this).classed("escondido", true);
    });
    d3.selectAll("path").each(function(x) {
      if (busca.indexOf(x) < 0) d3.select(this).classed("escondido", true);
    });

    var buscadosUnicos = [];
    $.each(buscados, function(i, el) {
      if ($.inArray(el, buscadosUnicos) === -1) buscadosUnicos.push(el);
    });
    //console.log(buscadosUnicos);
    vizinhoSegundoGrau(buscadosUnicos, lista);

  };

  function vizinhoSegundoGrau(nome, lista) {
    var busca = lista.filter(function(z) {
      return (nome.indexOf(z.source.name) > -1) || (nome.indexOf(z.target.name) > -1);
    });
    //console.log(lista, busca)
    var buscados = []
    if (busca.length > 0) {
      busca.forEach(function(y) {
        buscados.push(y.source.name);
        buscados.push(y.target.name);
      })
    };

    var buscadosUnicos = [];
    $.each(buscados, function(i, el) {
      if ($.inArray(el, buscadosUnicos) === -1) buscadosUnicos.push(el);
    });
    //console.log(buscadosUnicos);

    d3.selectAll("circle").each(function(x) {
      if ((buscados.indexOf(x.name) < 0) && (nome.indexOf(x.name) < 0) && d3.select(this).classed("escondido")) {
        d3.select(this).classed("escondidoDeFato", true);
        //console.log(x.name)
      }
    });
    d3.selectAll("path").each(function(x) {
      if ((busca.indexOf(x) < 0) && d3.select(this).classed("escondido")) d3.select(this).classed("escondidoDeFato", true);
    });

  };

  function vizinhoFiltro(nome, lista) {
    var busca = lista.filter(function(z) {
      return (z.source.name == nome) || (z.target.name == nome);
    });

    var classesVisiveis = [];
    $('.filtro-legenda').each(function() {
      if ($(this).hasClass('ativo')) {
        var thisTipo = $(this).data('tipo');
        classesVisiveis.push(thisTipo);
      };
    });

    var buscados = []
    if (busca.length > 0) {
      busca.forEach(function(y) {
        if (classesVisiveis.indexOf(y.source.classe[0]) > -1) buscados.push(y.source.name);
        if (classesVisiveis.indexOf(y.target.classe[0]) > -1) buscados.push(y.target.name);
      })
    };
    d3.selectAll("circle").each(function(x) {
      if ((buscados.indexOf(x.name) < 0) && (nome.indexOf(x.name) < 0)) d3.select(this).classed("escondido", true);
    });
    d3.selectAll("path").each(function(x) {
      if ((x.source.name != nome) && (x.target.name != nome)) d3.select(this).classed("escondido", true);
    });

    var buscadosUnicos = [];
    $.each(buscados, function(i, el) {
      if ($.inArray(el, buscadosUnicos) === -1) buscadosUnicos.push(el);
    });
    vizinhoFiltroSegundoGrau(buscadosUnicos, lista);
  };

  function vizinhoFiltroSegundoGrau(nome, lista) {
    var busca = lista.filter(function(z) {
      return (nome.indexOf(z.source.name) > -1) || (nome.indexOf(z.target.name) > -1);
    });
    var buscados = []
    if (busca.length > 0) {
      busca.forEach(function(y) {
        buscados.push(y.source.name);
        buscados.push(y.target.name);
      })
    };
    d3.selectAll("circle").each(function(x) {
      if ((buscados.indexOf(x.name) < 0) && (nome.indexOf(x.name) < 0) && d3.select(this).classed("escondido")) d3.select(this).classed("escondidoDeFato", true);
    });
    d3.selectAll("path").each(function(x) {
      if ((nome.indexOf(x.source.name) < 0) && (nome.indexOf(x.target.name) < 0) && d3.select(this).classed("escondido")) {d3.select(this).classed("escondidoDeFato", true);}
    });
  };

  function vizinhoLegenda(arrayClasse) {
    var buscados = [];

    d3.selectAll("circle, path").classed("escondidoLeg", true);

    d3.selectAll("circle").each(function(x) {
      if ((arrayClasse.indexOf(x.classe[0]) > -1)) {
        d3.select(this).classed("escondidoLeg", false);
        buscados.push(x.name);
      }
    });

    d3.selectAll("path").each(function(x) {
      if ((buscados.indexOf(x.source.name) > -1) && (buscados.indexOf(x.target.name) > -1)) {
        d3.select(this).classed("escondidoLeg", false)
      };
    });

  };

  function baixaBaseDados() {

    var promises = [];

    //Baixa Lista de sinais
    var def1 = new $.Deferred();
    $.ajax({
      url: urlSinais,
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

    return $.when.apply(undefined, promises).promise();
  };


  return {
    inicializa: afterLoad
  }

})();

$(document).ready(loadpage.inicializa);