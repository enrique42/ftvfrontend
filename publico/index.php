<?php
	$url = "http://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'] . "sinais";
	header('Location: '.$url);
?>