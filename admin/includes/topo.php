<?php 
	$urlpath = $_SERVER['REQUEST_URI'];
	$urlpath = substr($urlpath, 0, strpos($urlpath, "/admin/"));
	echo $urlpath;
	$url = "http://" . $_SERVER['SERVER_NAME'] . $urlpath . "/admin/";
	$twitter = 'twitter/';
	$sinais = 'sinais/';
?>
<div class="barra-topo-logo">
	<div class="telefonica-vivo"></div>
</div>
<div class="barra-topo-menu z-depth-1">
	<div class="container-barra">
		<ul class="lista-links-esquerda">

			<?php if ($pagina == 'twitter') { ?>
			<li class="item-menu ativo"><a href="">Time Series</a> <a href="" class="explica js-abre-modal" data-modal="modal-timeseries"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="<?php echo $url.$sinais.'?viz=1' ?>">Heatmap</a> <a href="" class="explica js-abre-modal" data-modal="modal-heatmap"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="<?php echo $url.$sinais.'?viz=2' ?>">Force-Based Graph</a> <a href="" class="explica js-abre-modal" data-modal="modal-force"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="<?php echo $url.$sinais.'?viz=4' ?>">Sinais Geolocalizados (Mundo)</a> <a href="" class="explica js-abre-modal" data-modal="modal-geo"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="<?php echo $url.$sinais.'?viz=3' ?>">Sinais Geolocalizados (Brasil)</a> <a href="" class="explica js-abre-modal" data-modal="modal-geo"><i class="fa fa-question-circle"></i></a></li>
			
			<?php } else { ?>
			<li class="item-menu"><a href="<?php echo $url.$twitter.'' ?>">Time Series</a> <a href="" class="explica js-abre-modal" data-modal="modal-timeseries"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="1" data-titulo="Heatmap">Heatmap</a> <a href="" class="explica js-abre-modal" data-modal="modal-heatmap"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="2" data-titulo="Force-Based Graph">Force-Based Graph</a> <a href="" class="explica js-abre-modal" data-modal="modal-force"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu ativo"><a href="" class="seleciona-viz" data-alvo="4" data-titulo="Sinais Geolocalizados (Mundo)">Geolocalização (Mundo)</a> <a href="" class="explica js-abre-modal" data-modal="modal-geo"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="3" data-titulo="Sinais Geolocalizados (Brasil)">Geolocalização (Brasil)</a> <a href="" class="explica js-abre-modal" data-modal="modal-geo"><i class="fa fa-question-circle"></i></a></li>
			<?php } ?>
			
		</ul>
		<ul class="lista-links-direita">
			<?php if ($pagina == 'twitter') { ?>
			<li class="item-menu"><a href="" class="abre-filtros" title="Abre os filtros">Filtros</a></li>
			<?php } ?>
			<li class="item-menu"><a href="" class="js-abre-modal" data-modal="modal-glossario" title="Glossário">Glossário</a></li>
			<li class="item-menu"><a href="" class="abre-salvar-sinal" title="Salvar sinal">Salvar Sinal</a></li>
			<?php if ($pagina == 'sinais') { ?>
			<li class="item-menu"><a href="" target="_blank" class="js-exportar-sinais" title="Exportar sinais">Exportar Sinais</a></li>
			<?php } ?>
			<li class="item-menu"><a href="#" class="desconectar">Desconectar</a></li>
		</ul>
	</div>
</div>

<div class="top-fixed z-depth-1 hide">
	<div class="header-dashboard">
		<a href="http://fundacaotelefonica.org.br/" class="logo-fundacao">
			<img src="../imgs/logo-fundacao.png">
		</a>
		<h3 class="titulo-viz"><?php echo $tituloTopo; ?></h3>
		<?php //if ($pagina == 'twitter') { ?>
			<a href="" class="abre-filtros" title="Abre os filtros"><i class="mdi-action-dashboard"></i> Filtros</a>
		<?php //} ?>
		<a href="" class="abre-salvar-sinal" title="Salvar sinal"><i class="mdi-content-save"></i> Salvar Sinal</a>
		<a href="" class="abre-mockup" title="Salvar sinal">Macrotrendências</a>
		<a href="" class="abre-mockup" title="Salvar sinal">Relatório Final</a>
		<a href="" class="abre-menu" title="Abre o menu de navegação">Menu <i class="mdi-navigation-menu"></i></a>
		
		<?php if ($pagina == 'twitter') { ?>
		<div class="container-menu-nav z-depth-1">
			<ul class="menu-nav ">
				<li class="item-menu"><a href="">Área do Administrador</a></li>
				<li class="item-menu"><a href="<?php echo $url.$sinais.'?viz=1' ?>">Heatmap</a></li>
				<li class="item-menu"><a href="<?php echo $url.$sinais.'?viz=2' ?>">Force-Based Graph</a></li>
				<li class="item-menu"><a href="<?php echo $url.$sinais.'?viz=4' ?>">Sinais Geolocalizados (Mundo)</a></li>
				<li class="item-menu"><a href="<?php echo $url.$sinais.'?viz=3' ?>">Sinais Geolocalizados (Brasil)</a></li>
				<li class="item-menu"><a href="#" class="desconectar">Desconectar</a></li>
			</ul>
		</div>
		<?php } else { ?>
		<div class="container-menu-nav z-depth-1">
			<ul class="menu-nav ">
				<li class="item-menu"><a href="<?php echo $url.$twitter.'' ?>">Área do Administrador</a></li>
				<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="1" data-titulo="Heatmap">Heatmap</a></li>
				<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="2" data-titulo="Force-Based Graph">Force-Based Graph</a></li>
				<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="4" data-titulo="Sinais Geolocalizados (Mundo)">Sinais Geolocalizados (Mundo)</a></li>
				<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="3" data-titulo="Sinais Geolocalizados (Brasil)">Sinais Geolocalizados (Brasil)</a></li>
				<li class="item-menu"><a href="#" class="desconectar">Desconectar</a></li>
			</ul>
		</div>
		<?php } ?>
		
	</div>	
</div>