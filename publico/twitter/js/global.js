var modulo = (function(){
  var equipeTemplate;

  function afterLoad(){
    equipeTemplate = $('#janela-tweets').html();
    Mustache.parse(equipeTemplate);

    $('.close-janela').on('click', function(event){
        event.preventDefault();
        $('.janela-dados').removeClass('ativo');
    });

    $('body').on('click', '.salvar-tweet', function(event) {
      event.preventDefault();
      var $parent = $(this).parents('.tweet-single');
      var tweetTxt = $parent.find('.texto-tweet').text();
      var autorTxt = $('#nome-perfil').text();

      $('#dados-tweet-save').text(tweetTxt);
      $('#dados-autor-save').text(autorTxt);

      $('.janela-save').addClass('ativo');
    });

    $('.close-janela-save').on('click', function(event){
      event.preventDefault();
      $('.janela-save').removeClass('ativo');
    });

    var margin = 20,
      diameter = 800;

    var color = d3.scale.linear()
      .domain([-1, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    var pack = d3.layout.pack()
      .padding(2)
      .size([diameter - margin, diameter - margin])
      .value(function(d) {
      return d.size;
    })

    var svg = d3.select("#chart").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var escalaRaio = d3.scale.pow().exponent(0.55).domain([0, 150000]).range([0, 10]);
    var escalaRange = d3.scale.pow().exponent(3.5).domain([1, 1000]).rangeRound([10, 500000]);
    var dados = [];
    var contas = [];
    var indice = {};
    var indicedescritor = {};

    d3.json('js/tudojunto2.json', function(lido) {
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
      contas = lido.contas;
      lista = dados.map(function(d) {
        return d.descritor
      }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });
      imprimeTreeMap($(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));
    });

    function imprimeTreeMap(range, dia) {
      d3.select("svg").remove();

      pack = d3.layout.pack()
        .padding(2)
        .size([diameter - margin, diameter - margin])
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
          e.childrenXXX = dados.filter(function(f) {
            return (f.idconta == e.id) && (f.data >= dia.min) && (f.data <= dia.max) && (f.retweets >= escalaRange(range.min)) && (f.retweets <= escalaRange(range.max));
          });
          e.size = e.childrenXXX.reduce(function(g, h) {
            return g + h.retweets
          }, 0);
          e.size = escalaRaio(e.size);
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
        return d.children ? color(d.depth) : null;
      })
        .on("click", function(d) {
          if (focus !== d) {
            d3.event.stopPropagation();
            if (focus.depth === 0) {
              if (d.depth !== 2) {
                zoom(d);
              }
            } else if (focus.depth === 1) {
              if (d.depth === 2) {
                carregaJanela(d.id, d.descritor, root);
                $('.janela-dados').addClass('ativo');
              } else {
                zoom(root);
              }
            } else {

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



    };

    d3.select(self.frameElement).style("height", diameter + "px");

    $(document).ready(function() {
      $(".controlerange").rangeSlider({
        bounds: {
          min: 1,
          max: 1000
        },
        defaultValues: {
          min: 1,
          max: 168.92
        },
        formatter: function(val) {
          return escalaRange(val);
        }
      });
      $(".controledata").dateRangeSlider({
        bounds: {
          min: new Date(2014, 0, 1),
          max: new Date()
        },
        defaultValues: {
          min: new Date(2015, 0, 1),
          max: new Date(2015, 4, 1)
        },
        step: {
          days: 1
        }
      });
      $('form.controle').change(function() {
        imprimeTreeMap($(".controlerange").rangeSlider("values"), $(".controledata").dateRangeSlider("values"));
      });
      $(".controlerange").bind("valuesChanged", function(e, data) {
        $('form.controle').trigger("change");
      });
      $(".controledata").bind("valuesChanged", function(e, data) {
        $('form.controle').trigger("change");
      });
    });

  };

  function carregaJanela(user, descritor, root){
      var descritor = $.grep(root.children, function(e){ return e.iddescritor == descritor; });
      var conta = $.grep(descritor[0].children, function(e){ return e.id == user; });
      $('.lista-tweets').empty();
      $('#nome-perfil').text(conta[0].conta);
      $('#num-tweet').text(conta[0].childrenXXX.length);
      for (var i = 0; i < conta[0].childrenXXX.length; i++) {
        var child = conta[0].childrenXXX[i];
        //console.log(child);
        var rendered = Mustache.render(equipeTemplate, {tempo: child.data, tweet: child.texto, retweets: child.retweets, autor: conta[0].conta, idtweet: child.idtweet });
        $('.lista-tweets').append(rendered);
      }
    }

  return {
      inicializa : afterLoad
  }    

})();

$(document).ready( modulo.inicializa );