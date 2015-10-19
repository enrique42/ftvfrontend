<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
  	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"/>
	<title>Projeto FTV</title>
	<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed:300italic,400italic,700italic,400,300,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	<link href='../css/materialize.css' rel='stylesheet' type='text/css'>
	<link href='../css/base.css' rel='stylesheet' type='text/css'>
	<link href='css/style.css' rel='stylesheet' type='text/css'>
</head>
<body>

<?php 
	$tituloTopo = 'Heatmap';
	$pagina = 'sinais';
	include('../includes/topo.php') 
?>


<div class="container-visu">
	<div id="regions_div"></div>
	<div id="heatmap"></div>
	<div id="grafo"></div>
	
	<div class="visu-controles-mapas">
		<a href="#" class="voltar-mundo"><i class="mdi-navigation-arrow-back"></i> Ver Mapa-mundi</a>
		<h3 class="instru-topo">Mostrando sinais com o tema: </h3>
		<select id="items"></select>	
		<h3 class="instru-bottom">Clique em um país para visualizar os sinais encontrados</h3>
		<a href="" class="ver-abrangencia z-depth-1">Ver sinais de abrangência nacional</a>
	</div>

	<div class="visu-controles-heatmap z-depth-1">
		<h3>Escolha: </h3>
		<a href="#" class="alterna-heatmap ativo" id="alterna-heatmap3">Temas por Subtemas</a>
		<a href="#" class="alterna-heatmap" id="alterna-heatmap1">Atributos por Subtemas</a>
		<a href="#" class="alterna-heatmap" id="alterna-heatmap2">Atributos por Temas</a>		
		<h3>Legenda: </h3>
		<div><i class="mdi-image-brightness-1 leg-iniciativa"></i> <span>Iniciativa</span></div>
		<div><i class="mdi-image-brightness-1 leg-produto"></i> <span>Produto</span></div>
		<div><i class="mdi-image-brightness-1 leg-evidencias"></i> <span>Evidências</span></div>
		<div><i class="mdi-image-brightness-1 leg-bibliografia"></i> <span>Bibliografia</span></div>
	</div>

	<div class="zoom">
		<a href="#" id="zoom_in" class="zoom-button zoom-plus"><i class="mdi-content-add-circle-outline"></i></a>
		<a href="#" id="zoom_out" class="zoom-button zoom-minus"><i class="mdi-content-remove-circle-outline"></i></a>
	</div>
	<div class="legenda-bloco z-depth-1">
		<h3>Legenda</h3>
		<ul class="lista-legenda">
			
			<li><a href="" class="filtro-legenda ativo" data-tipo="tema"><i class="mdi-image-brightness-1 leg-tema"></i><span>Temas</span><i class="mdi-navigation-check"></i></a></li>
			<li><a href="" class="filtro-legenda ativo" data-tipo="subtema"><i class="mdi-image-brightness-1 leg-subtema"></i><span>Subtema</span><i class="mdi-navigation-check"></i></a></li>
			<li><a href="" class="filtro-legenda ativo" data-tipo="nome"><i class="mdi-image-brightness-1 leg-nome"></i><span>Sinal</span><i class="mdi-navigation-check"></i></a></li>
			<li class="sinal-hi"><a href="" class="filtro-legenda" data-tipo="iniciativa"><i class="mdi-image-brightness-1 leg-iniciativa"></i><span>Sinal: Iniciativa</span><i class="mdi-navigation-check"></i></a></li>
			<li class="sinal-hi"><a href="" class="filtro-legenda" data-tipo="fase"><i class="mdi-image-brightness-1 leg-fase"></i><span>Sinal: Produto</span><i class="mdi-navigation-check"></i></a></li>
			<li class="sinal-hi"><a href="" class="filtro-legenda" data-tipo="bibliografia"><i class="mdi-image-brightness-1 leg-bibliografia"></i><span>Sinal: Bibliografia</span><i class="mdi-navigation-check"></i></a></li>
			<li class="sinal-hi"><a href="" class="filtro-legenda" data-tipo="protagonista"><i class="mdi-image-brightness-1 leg-protagonista"></i><span>Sinal: Protagonista</span><i class="mdi-navigation-check"></i></a></li>			 
			<li class="sinal-hi"><a href="" class="filtro-legenda" data-tipo="evidencias"><i class="mdi-image-brightness-1 leg-evidencias"></i><span>Sinal: Evidências</span><i class="mdi-navigation-check"></i></a></li>
			<li class="sinal-hi"><a href="" class="filtro-legenda" data-tipo="pais"><i class="mdi-image-brightness-1 leg-pais"></i><span>País</span><i class="mdi-navigation-check"></i></a></li>
			
		</ul>
	</div>

	<div class="visu-controles-force">
		<h3>Clique em um nó para isolá-lo e ver suas ligações.<br><span>Utilize o scroll do mouse para controlar o zoom da visualização.</span></h3>
	</div>

	<div class="force-node-texto">
		<h3>Mostrando Nó "<span id="nome-node"></span>"</h3>
		<a href="#" class="link-node">Clique <span>aqui</span> para ver os sinais pertencentes a este nó</a>
	</div>
</div>

<div class="container-form z-depth-2" id="janela-filtros">
	<div class="bloco-filtros">
		<a href="" class="close-janela-filtros mdi-navigation-close orange-text text-darken-4"></a>
		<h3>Filtros</h3>
		<div class="filtro-force">
			<label for="filtro_tema">Tema</label>
			<select id="filtro_tema">
				<option value="" disabled selected>Escolha o Tema</option>
			</select>
		</div>
		<div class="filtro-force">
			<label for="filtro_subtema">Subtema</label>
			<select id="filtro_subtema">
				<option value="" disabled selected>Escolha o Subtema</option>
			</select>
		</div>
		<div class="filtro-force">
			<label for="filtro_iniciativa">Iniciativa</label>
			<select id="filtro_iniciativa">
				<option value="" disabled selected>Escolha a Iniciativa</option>
			</select>
		</div>
		<div class="filtro-force">
			<label for="filtro_bibliografia">Bibliografia</label>
			<select id="filtro_bibliografia">
				<option value="" disabled selected>Escolha a bibliografia</option>
			</select>
		</div>
		<div class="filtro-force">
			<label for="filtro_fase">Fase</label>
			<select id="filtro_fase">
				<option value="" disabled selected>Em que fase está?</option>
			</select>
		</div>
		<div class="filtro-force">
			<label for="filtro_pais">País</label>
			<select id="filtro_pais">
				<option value="" disabled selected>País de origem</option>
			</select>
		</div>
		<div class="filtro-force">
			<label for="filtro_evidencias">Evidências</label>
			<select id="filtro_evidencias">
				<option value="" disabled selected>Escolha a evidência</option>
			</select>
		</div>
	</div>
</div>

<div class="container-form z-depth-2" id="janela-mostra-sinais">
	<div class="bloco-sinais">
		<a href="" class="close-janela-mostra-sinais mdi-navigation-close orange-text text-darken-4"></a>
		<h3>Sinais Encontrados</h3>
		<h4 id="desc-sinais"></h4>
		<div class="lista-sinais">
			
		</div>
	</div>
</div>

<div class="container-loading valign-wrapper">
	<div class="progresso-loading valign">
		<h3>Carregando base de dados...</h3>
		<div class="progress">
			<div class="indeterminate" style="width: 70%"></div>
		</div>
		<p id="aviso_load">Carregando <span id="num_carga">0</span> de <span id="total_carga">0</span> pacotes</p>
	</div>	
</div>

<?php include('../includes/bottom.php'); ?>

<?php include('../includes/modais.php'); ?>

<script type="text/javascript" src="../libs/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi?autoload={'modules':[{'name':'visualization','version':'1.1','packages':['geochart']}]}"></script>
<script type="text/javascript" src="../libs/d3.min.js" charset="utf-8"></script>
<script type="text/javascript" src="../libs/d3.tip.v0.6.3.js" charset="utf-8"></script>
<script type="text/javascript" src="../libs/jquery.autocomplete.min.js" charset="utf-8"></script>
<script type="text/javascript" src="../libs/mustache.min.js"></script>

<script id="janela-tweets" type="x-tmpl-mustache">
	<div class="tweet-single">
		<div id="dados-data" class="orange-text text-darken-4">{{tempo}}</div>
		<div class="texto-tweet">{{tweet}}</div>
		<div class="dados-tweet">
			<span id="dados-ret">Retweets: <small class="orange-text text-darken-4">{{retweets}}</small> - </span>
			<a href="http://twitter.com/{{autor}}/status/{{idtweet}}" target="_blank" class="link-tweet orange-text text-darken-4">Abrir no Twitter</a><span> - </span>
		</div>				
	</div>
</script>



<script id="janela-lista-sinais" type="x-tmpl-mustache">
	<div class="sinais-single">
		<div class="sinal-linha sl-simples">
			<div class="sinal-texto sinal-texto-titulo"><span>Nome: </span>{{nome}}</div>	
		</div>
		<div class="sinal-desc"><strong>Descrição: </strong> {{desc}} - </div>
		<div class="sinal-desc-info"><strong>Informações Adicionais: </strong> {{info_add}}</div>
		<div class="sinal-linha">
			<div class="sinal-texto"><span>Link: </span>{{url}}</div>
			<div class="sinal-texto"><span>Fonte: </span>{{fonte}}</div>	
		</div>
		<div class="sinal-linha">
			<div class="sinal-texto"><span>Tema: </span>{{tema}}</div>
			<div class="sinal-texto"><span>Subtemas: </span>{{tag1}}, {{tag2}}</div>
		</div>
		<div class="sinal-linha">
			<div class="sinal-texto"><span>Iniciativa: </span>{{iniciativa}}</div>
			<div class="sinal-texto"><span>Bibliografia: </span>{{bibliografia}}</div>		
		</div>
		<div class="sinal-linha">
			<div class="sinal-texto"><span>Produto: </span>{{fase}}</div>
			<div class="sinal-texto"><span>Protagonista: </span>{{protagonista}}</div>
		</div>
		<div class="sinal-linha">
			<div class="sinal-texto"><span>País: </span>{{pais}}</div>
			<div class="sinal-texto"><span>Cidade: </span>{{cidade}}</div>		
		</div>
		<div class="sinal-linha">			
			<div class="sinal-texto"><span>Evidências: </span>{{evidencias}}</div>		
		</div>
		<div class="sinal-invisivel" data-sinalid="{{sinalid}}" data-tweetid="{{tweetid}}" data-nome="{{nome}}" data-desc="{{desc}}" data-infoadd="{{info_add}}" data-url="{{url}}" data-tema="{{tema}}" data-tag1="{{tag1}}" data-tag2="{{tag2}}" data-iniciativa="{{iniciativa}}" data-bibliografia="{{bibliografia}}" data-produto="{{produto}}" data-fase="{{fase}}" data-pais="{{pais}}" data-cidade="{{cidade}}" data-fonte="{{fonte}}" data-evidencias="{{evidencias}}"></div>


	</div>
</script>
<?php 
	include(dirname(dirname(dirname(__FILE__))).'/setup.php');
?>
<script src="js/loadpage.js?v5"></script>
</body>
</html>