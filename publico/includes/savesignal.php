<div class="janela-save card-panel z-depth-2 ">
	<div class="janela-container">
		<a href="" class="close-janela-save mdi-navigation-close orange-text text-darken-4"></a>
		<div class="row">
			<div class="col s12 texto-autor">
				<h3>Editar Sinal</h3>
			</div>
		</div>
		<div class="row">
			<form class="col s12" action="#" id="form_savesignal">
				<div class="row">
					<div class="input-field col s12">
						<label class="text" for="sign_nome">Nome do Sinal</label>
						<input placeholder="Digite um nome para identificar este sinal" id="sign_nome" type="text" class="validate">	
					</div>
				</div>
				<div class="row">
					<div class="input-field col s12">
						<label for="sign_conteudo">Conteúdo</label>
						<textarea id="sign_conteudo" type="text" height="100" class="validate"></textarea>	
					</div>					          		
				</div>
				<div class="row">
					<div class="input-field col s12">
						<label for="sign_infoadd">Informações adicionais</label>
						<textarea id="sign_infoadd" type="text" height="50" class="validate"></textarea>	
					</div>					          		
				</div>
				<div class="row">
					<div class="input-field col s12">
						<label class="text" for="sign_url">Link</label>
						<input placeholder="Cole o link do sinal, se possível" id="sign_url" type="text" class="validate">	
					</div>
				</div>
				<div class="row">
					<div class="input-field col s6">
						<label for="sign_tema">Tema</label>
						<select id="sign_tema">
							<option value="" disabled selected>Escolha o Tema</option>
						</select>
					</div>
					<div class="input-field col s6">
						<label for="sign_subtema">Subtema / Tags</label>
						<div class="habilita-subtema">Clique para marcar as tags</div>
						<div class="lista-subtemas card-panel  z-depth-2">
							<h3>Escolha até dois subtemas</h3>
							<a href="" class="close-subtema mdi-navigation-close orange-text text-darken-4"></a>
							<div class="colunas-subtemas"></div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s6">
						<label for="sign_iniciativa">Iniciativa</label>
						<select id="sign_iniciativa">
							<option value="" disabled selected>Escolha a Iniciativa</option>
						</select>
					</div>
					<div class="input-field col s6">
						<label for="sign_bibliografia">Bibliografia</label>
						<select id="sign_bibliografia">
							<option value="" disabled selected>Escolha a bibliografia</option>
						</select>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s6">
						<label class="text" for="sign_protagonista">Protagonista?</label>
						<select id="sign_protagonista">		
							<option value="false" selected>Não</option>					
							<option value="true">Sim</option>							
						</select>
					</div>
					<div class="input-field col s6">
						<label for="sign_fase">Produto</label>
						<select id="sign_fase">
							<option value="" disabled selected>Em que fase está?</option>
						</select>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s6">
						<label for="sign_pais">País</label>
						<select id="sign_pais">
							<option value="" disabled selected>País de origem</option>
						</select>
					</div>
					<div class="input-field col s6">
						<label for="sign_cidade">Cidade</label>
						<select id="sign_cidade">
							<option value="" disabled selected>Cidade de origem</option>
						</select>
					</div>
				</div>
				<div class="row">
					<div class="input-field col s6">
						<label for="sign_fonte">Fonte</label>
						<select id="sign_fonte">
							<option value="" disabled selected>Escolha a fonte</option>
						</select>
					</div>
					<div class="input-field col s6">
						<label for="sign_evidencias">Evidências</label>
						<select id="sign_evidencias">
							<option value="" disabled selected>Escolha a evidência</option>
						</select>
					</div>
				</div>
				<div class="invisible-row">
					<input type="hidden" name="sign_sinalid" id="sign_sinalid" value="">
					<input type="hidden" name="sign_tweetid" id="sign_tweetid" value="">
					<input type="hidden" name="sign_editar" id="sign_editar" value="false">
				</div>
				<div class="row">
					<div class="input-field col s12 if-salvar">
	        			<a class="waves-effect waves-light btn orange right" id="salva-sinal"><i class="mdi-file-cloud left"></i>Salvar</a>
	        			<span class="sucesso">Dados salvos com sucesso!</span>
	        		</div>	
				</div>
			</form>	
		</div>
		
		<!-- <div class="lista-tweets-save">
			<div id="dados-tweet-save" class="texto-tweet">Epic victimhood play by Julio Rubeiro. http://t.co/jbfIlPZMrP Christian schools are subsidized by taxpayers - mostly Hindu taxpayers.</div>
			<div id="dados-autor-save" class="orange-text text-darken-4">Autor: rmantri</div>
		</div>
		<div class="formulario-save">
			<h4>Preencha os dados abaixo para classificar este tweet:</h4>
			<div class="row">
				<div class="input-field col s6">
	          		<input id="form-Autor" type="text" class="validate">
	          		<label for="form-Autor">Autor</label>
	        	</div>
	        	<div class="input-field col s6">
	        		<label>Categoria</label>
				    <select class="browser-default">
				      <option value="" disabled selected>Escolha a categoria</option>
				      <option value="1">Indivíduo</option>
				      <option value="2">Academia</option>
				      <option value="3">Organização</option>
				      <option value="4">Empresa</option>
				    </select>
	        	</div>
				<div class="input-field col s12">
	          		<textarea id="form-tweet" type="text" height="100" class="validate"></textarea>
	          		<label for="form-tweet">Comentário</label>
	        	</div>
	        	<div class="input-field col s12">
	        		<a class="waves-effect waves-light btn orange right"><i class="mdi-file-cloud left"></i>Salvar</a>
	        	</div>	        	
	        </div>
		</div> -->
	</div>
</div>