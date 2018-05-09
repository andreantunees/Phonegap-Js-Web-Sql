var myApp = new Framework7();
var db;

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

function Enviar1()
{
  console.log("Deads ready!");
}

$$(document).on('deleted', '.remove-callback', function(){
  var apresentacaoId = $$(this).attr('id');
  deletarApresentacao(apresentacaoId);
});

$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    db = window.openDatabase('apresentacao', '1.0', 'Apresentacao TCC', 1000000);
    createDatabase();
    getCampus();
});

myApp.onPageInit('index', function (page) {
  getCampus();
})

myApp.onPageInit('admin', function (page) {
  getApresentacao();
})

//adicionar usuario
myApp.onPageInit('createlogin', function (page) {
  $$('.form-to-data').on('click', function(){
    var data = {
      usuario: $$('#usuario').val(),
      senha:   $$('#senha').val(),
    }

    if( $$('#chave').val() == 2012204292 && $$('#usuario').val() != null && $$('#senha').val()){
        addLogin(data);
        alert("Usuário Cadastrado!!  " + " Usuario: " + $$('#usuario').val() + "/ Senha: " + $$('#senha').val());
    }else{
        alert("Cadastro inválido!!");
    }
  });
})

//adicionar usuario
myApp.onPageInit('login', function (page) {
  $$('.form-to-data').on('click', function(){
    var data = {
      usuario: $$('#usuario').val(),
      senha:   $$('#senha').val(),
    }
    verificaLogin(data);
  });
})

//adicionar apresentacao
myApp.onPageInit('add', function (page) {
  $$('.form-to-data').on('click', function(){
    var data = {
      id:guidGenerator(),
      tema: $$('#tema').val(),
      data: $$('#data').val(),
      hora: $$('#hora').val(),
      aluno: $$('#aluno').val(),
      orientador: $$('#orientador').val(),
      sobre: $$('#sobre').val(),
      local: $$('#local').val(),
      campus: $$('#campus').val(),
    }
    addApresentacao(data);
  });
})

myApp.onPageInit('apresentacoes', function(page){
  var campus = page.query.id;
  console.log("hahahah!" + campus);
  getApresentacaoCampus(campus);
})

//detalhe apresentacao
myApp.onPageInit('detalhe', function (page) {
  var apresentacaoID = page.query.id;
  getApresentacaoDetalhe(apresentacaoID);
})

function createDatabase(){
  db.transaction(createTable,
  function(tx, err){
    alert('DB Error: '+err);
  },
  function(){
    console.log('Base & Tabela Criada...');
  });
}

function createTable(tx){
  tx.executeSql('CREATE TABLE IF NOT EXISTS login (id integer primary key autoincrement, usuario, senha)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS campus (id integer primary key autoincrement, campus)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS apresentacao (id unique, tema, data, hora, aluno, orientador, sobre, local, campus)');
  tx.executeSql('DELETE FROM campus');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"Alegre")');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"Jerônimo Monteiro")');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"Goiabeiras")');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"Maruípe")');
  tx.executeSql('INSERT INTO campus (id, campus) values (null,"São Matheus")');
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

//funcoes para criar usuario createlogin ----------------------------
function addLogin(login){
  db.transaction(function(tx){
    tx.executeSql('INSERT INTO login(id, usuario, senha) values (null,"'+login.usuario+'","'+login.senha+'")')
  },
  function(err){
    console.log(err);
  },
  function(){
  });
}
//funcoes para criar usuario createlogin ----------------------------

//funcoes para autenticar login -------------------------------------
function verificaLogin(data){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM login where usuario = "'+data.usuario+'" and senha = "'+data.senha+'"',[],
    function(tx,results){
      var len = results.rows.length;
      if(len > 0){
        alert("Login efetuado com sucesso!!");
        console.log('login encontrado');
        document.getElementById("validar").style.visibility = "hidden";
        $$('#botao-entrar').append(`
          <a href="admin.html" id="entrar" class="button button-big form-to-data">Entrar</a>
          `);
      }else {
        alert("Usuario e Senha inválidos!!");
        console.log('inválido');
      }
    },
    function(err){
      console.log(err);
    });
  });
}
//funcoes para autenticar login -------------------------------------

//funcoes para exibir apresentacao geral ----------------------------
function getApresentacaoCampus(id) {
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM apresentacao where campus = (select campus from campus where id = "'+id+'") ORDER BY data DESC',[],
      function(tx,results){
        var len = results.rows.length;
        console.log('apresentacao campus table: '+len+'rows found');
        for(var i = 0; i<len ; i++){
          $$('#apresentacao-list-campus').append(`
            <li class="swipeout remove-callback" id="${results.rows.item(i).id}">
              <a href="detalhe.html?id=${results.rows.item(i).id}" class="item-link swipeout-content item-content">
                <div class="item-inner">
                  <div class="item-title">${results.rows.item(i).tema}</div>
                  <div class="item-after">${results.rows.item(i).data}</div>
                </div>
              </a>
            </li>
            `);
        }
      },
      function(err){
        console.log(err);
      });
    });
  }
//funcoes para exibir apresentacao geral ----------------------------
//funcoes para apresentacao admin--------------------------------------------------------------------
function addApresentacao(app){
  db.transaction(function(tx){
    tx.executeSql('INSERT INTO apresentacao(id,tema,data,hora,aluno, orientador, sobre, local, campus) values ("'+app.id+'","'+app.tema+'","'+app.data+'","'+app.hora+'","'+app.aluno+'","'+app.orientador+'","'+app.sobre+'","'+app.local+'","'+app.campus+'")')
  },
  function(err){
    console.log(err);
  },
  function(){
  });
}

function getApresentacao(){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM apresentacao ORDER BY data DESC',[],
    function(tx,results){
      var len = results.rows.length;
      console.log('apresentacao table: '+len+'rows found');
      for(var i = 0; i<len ; i++){
        $$('#apresentacao-list').append(`
          <li class="swipeout remove-callback" id="${results.rows.item(i).id}">
            <a href="detalhe.html?id=${results.rows.item(i).id}" class="item-link swipeout-content item-content">
              <div class="item-inner">
                <div class="item-title">${results.rows.item(i).tema}</div>
                <div class="item-after">${results.rows.item(i).data}</div>
              </div>
            </a>
            <div class="swipeout-actions-right">
              <a href="#" class="swipeout-delete">Delete</a>
            </div>
          </li>
          `);
      }
    },
    function(err){
      console.log(err);
    });
  });
}

function deletarApresentacao(id){
  db.transaction(function(tx){
    tx.executeSql('DELETE FROM apresentacao WHERE id ="'+id+'"');
  },
  function(err){
    console.log(err);
  },
  function(){
    console.log('Apresentacao Deletada');
  });
}

function getApresentacaoDetalhe(id) {
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM apresentacao WHERE id ="'+id+'"', [],
    function(tx, results){
      $$('#apresentacao-detalhe').html(`
        <div class="card">
          <div class="card-header">${results.rows[0].tema}</div>
          <div class="card-content">
            <div class="card-content-inner">
              <ul>
                <li>Aluno: ${results.rows[0].aluno}</li>
                <li>Orientador: ${results.rows[0].orientador}</li>
                <li>Sobre: ${results.rows[0].sobre}</li>
                <li>Local: ${results.rows[0].local}</li>
                <li>Campus: ${results.rows[0].campus}</li>
              </ul>
            </div>
          </div>
          <div class="card-footer">Data: ${results.rows[0].data} às ${results.rows[0].hora}</div>
        </div>
      `);
    },
    function(err){
      console.log(err);
    });
  });
}
//funcoes para apresentacao --------------------------------------------------------------------

//campus -------------------------------
function getCampus(){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM campus ORDER BY campus DESC',[],
    function(tx,results){
      var len = results.rows.length;
      console.log('campus table: '+len+'rows found');
      for(var i = 0; i<len ; i++){
        $$('#campus-list').append(`
          <li class="swipeout remove-callback" id="${results.rows.item(i).id}">
            <a href="apresentacoes.html?id=${results.rows.item(i).id}" class="item-link swipeout-content item-content">
              <div class="item-inner">
                <div class="item-title">${results.rows.item(i).campus}</div>
              </div>
            </a>
          </li>
          `);
      }
    },
    function(err){
      console.log(err);
    });
  });
}
//campus -------------------------------
