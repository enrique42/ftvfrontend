<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
  	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"/>
	<title></title>
	<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed:300italic,400italic,700italic,400,300,700' rel='stylesheet' type='text/css'>
	<link href='../css/metricsgraphics.css' rel='stylesheet' type='text/css'>
	<link href="css/iThing-min.css" rel="stylesheet">
	<link href='../css/materialize.css' rel='stylesheet' type='text/css'>
	<link href='../css/base.css' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	<link href='css/style.css' rel='stylesheet' type='text/css'>
</head>
<body>

<?php 
	$tituloTopo = 'Time Series';
	$pagina = 'twitter';
	include('../includes/topo.php') 
?>

<div class="container-login valign-wrapper ativo">
	<div class="bloco-login valign center-align z-depth-1">
		<div class="row">
			<h1>Projeto FTV</h1>
			<div class="input-field col s12">
				<label class="text" for="log_login">Login</label>
				<input placeholder="Digite seu login" id="log_login" type="text" class="validate">	
			</div>
			<div class="input-field col s12">
				<label class="text" for="log_senha">Senha</label>
				<input placeholder="Digite seu login" id="log_senha" type="password" class="validate">	
			</div>
			<div class="input-field col s12">
				<a class="waves-effect waves-light btn orange right" id="login-site"><i class="ic_perm_identity center"></i>Entrar</a>
			</div>
		</div>
	</div>
</div>


<!-- <a href="#" class="alterna-grafico alterna-volume ativo"><i class="mdi-action-group-work"></i> Visualização de Volume de Retweets</a>
<a href="#" class="alterna-grafico alterna-timeseries"><i class="mdi-editor-insert-chart"></i> Visualização Time Series</a> -->
<div class="container-visu">
	<div id="chart"></div>
	<div id="container"></div>
</div>


<div class="container-loading valign-wrapper">
	<div class="progresso-loading valign">
		<h3 id="titulo-loading">Carregando base de dados...</h3>
		<div class="progress">
			<div class="indeterminate" style="width: 70%"></div>
		</div>
		<p id="aviso_load">Carregando <span id="num_carga">0</span> de <span id="total_carga">0</span> pacotes</p>
	</div>	
</div>

<!-- <div class="container-form">
	<h3>Filtros</h3>
	<form class="controle" action="">
		<select class="controleselect"></select><br><br>
		<div class="controlerange"></div>
		<div class="controlerange-label">Selecione a faixa de retweets</div>
		<div class="controledata"></div>
		<div class="controlerange-label">Escolha um período de tempo</div>
	</form>
</div> -->

<div class="container-form z-depth-2" id="janela-filtros">
	<div class="bloco-filtros">
		<a href="" class="close-janela-filtros mdi-navigation-close orange-text text-darken-4"></a>
		<h3>Filtros</h3>
		<form class="controle" action="">
			<select class="controleselect"></select><br><br>
			<div class="controlerange"></div>
			<div class="controlerange-label">Selecione a faixa de retweets</div>
			<div class="controledata"></div>
			<div class="controlerange-label">Escolha um período de tempo</div>
		</form>
	</div>
</div>


<div class="janela-dados card-panel z-depth-2">
	<div class="janela-container">
		<a href="" class="close-janela mdi-navigation-close orange-text text-darken-4"></a>
		<div class="texto-autor">
			<h3 id="titulo-janela-lista">Lista de Tweets</h3>
			<h4 id="descricao-janela-lista">Foram encontrados <span id="num-tweet">600</span> tweets:</h4>
		</div>
		<div class="lista-tweets">
			
		</div>
	</div>
</div>

<?php include('../includes/bottom.php'); ?>

<?php include('../includes/modais.php'); ?>

<?php include('../includes/savesignal.php'); ?>

<script type="text/javascript" src="../libs/jquery-2.1.4.min.js"></script>

<script type="text/javascript" src="../libs/rhaboo.min.js"></script>

<script type="text/javascript" src="../libs/d3.min.js" charset="utf-8"></script>
<script type="text/javascript" src="../libs/d3.tip.v0.6.3.js" charset="utf-8"></script>
<script type="text/javascript" src="../libs/metricsgraphics.min.js"></script>
<script type="text/javascript" src="../libs/jquery-ui.min.js"></script>
<script type="text/javascript" src="../libs/jQAllRangeSliders-min.js"></script>
<script type="text/javascript" src="../libs/mustache.min.js"></script>

<script id="janela-tweets" type="x-tmpl-mustache">
	<div class="tweet-single">
		<div id="dados-data" class="orange-text text-darken-4">{{tempo}}</div>
		<div class="texto-tweet">{{tweet}}</div>
		<div class="autor-tweet">Autor: {{autor}}</div>
		<div class="dados-tweet">
			<span id="dados-ret">Retweets: <small class="orange-text text-darken-4">{{retweets}}</small> - </span>
			<a href="http://twitter.com/{{autor}}/status/{{idtweet}}" target="_blank" class="link-tweet orange-text text-darken-4">Abrir no Twitter</a><span> - </span>
			<a href="#" class="link-tweet editar-sinal orange-text text-darken-4">Salvar Tweet</a>
		</div>
		<div class="sinal-invisivel" data-conteudo="{{tweet}}, por {{autor}}" data-nome="Tweet de {{autor}} em {{tempo}}" data-url="http://twitter.com/{{autor}}/status/{{idtweet}}" data-tweetid="{{idtweet}}" ></div>				
	</div>
</script>
<?php 
	include(dirname(dirname(dirname(__FILE__))).'/setup.php');
?>
<script src="js/loadpage.js?v3"></script>
</body>
</html>