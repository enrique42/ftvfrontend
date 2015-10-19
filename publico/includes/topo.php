<?php 
	$url = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
	$twitter = 'twitter/';
	$sinais = 'sinais/';
?>
<div class="barra-topo-logo">
	<div class="telefonica-vivo"></div>
</div>
<div class="barra-topo-menu z-depth-1">
	<div class="container-barra">
		<ul class="lista-links-esquerda">
			<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="1" data-titulo="Heatmap">Heatmap</a> <a href="" class="explica js-abre-modal" data-modal="modal-heatmap"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="2" data-titulo="Force-Based Graph">Force-Based Graph</a> <a href="" class="explica js-abre-modal" data-modal="modal-force"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu ativo"><a href="" class="seleciona-viz" data-alvo="4" data-titulo="Sinais Geolocalizados (Mundo)">Geolocalização (Mundo)</a> <a href="" class="explica js-abre-modal" data-modal="modal-geo"><i class="fa fa-question-circle"></i></a></li>
			<li class="item-menu"><a href="" class="seleciona-viz" data-alvo="3" data-titulo="Sinais Geolocalizados (Brasil)">Geolocalização (Brasil)</a> <a href="" class="explica js-abre-modal" data-modal="modal-geo"><i class="fa fa-question-circle"></i></a></li>
		</ul>
		<ul class="lista-links-direita">
			<li class="item-menu"><a href="" class="js-abre-modal" data-modal="modal-glossario" title="Glossário">Glossário</a></li>
		</ul>
	</div>
</div>