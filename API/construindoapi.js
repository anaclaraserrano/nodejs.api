//1 passo:Criação do servidor
//2 passo: Exibir rota e método requirido
//3 passo: atribuit o metodo GET
//4 passo: Atribuir o método POST
//5 passo: Atribuir o método PUT
// 6 passo: Atribuir o médoto DELETE
//7 passo: ajustes para consumo da API

const http = require ('http');
const url = require ('url');

//Simulando um banco de dados com um array de objetos
let pedidos = [
    {
        id:1,
        cliente: "Ana",
        produto: "Bota",
        status: "pendente"
    }
]
const server = http.createServer((req, res) =>{

    res.setHeader('Content-Type', 'application/JSON')


    //leitura da url
    const urlCompleta = url.parse(req.url, true);

    //recebendo os dados 
    const rota = urlCompleta.pathname;
    const metodo = req.method;
 

    //Liberação do CORS :
    res.setHeader ("cess-Control-Allow-Origin", "*");
    res.setHeader ("Acess-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Acess-Control-Allow-Headers", "Content-Type");

    if(method ==="OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
    }

    //Criação do método GET
    //Com a condição para que a URL tenha /pedidos e o métodom seja o GET para que uma resposta expecifica
    if(rota === "/pedidos" && metodo === "GET") {

        //Resposta que será exibida para o usúario
        res.end(JSON.stringify({
            mensagem:'Lista de pedidos',
            dados: pedidos
        }));
        return; // Finaliza a requisição
    };

    //Criação do método POST
    if( rota === "/pedidos" && metodo === "POST") {
        //Variável body irá armazenar todas as partes do conteúdo enviados pela requisição
        let body = ' ';

        //.on = ação
        //Ao disparo da requisição, a ação referente ao armazenamento das partes dentro do body irá acontecer.
        req.on('data', parte => {
            body += parte; //Acumulo das partes na váriavel body
        });

        //.on= ação
        // No disparo da função, após o armazenamento das partes no body, damos inicio a ação final para processamento da requisição
            req.on('end', () => {
        const novoPedido = JSON.parse(body);

            //Incluindo o novoPedido no nosso array de pedidos
            pedidos.push (novoPedido);

            res.statusCode = 201;//Criado com sucesso


            //Resposta final para o usúario, a confirmação de cadastro do novo pedido acompanhado dos dados de novopedido
            res.end(JSON.stringify({
                mensagem: "Pedido cadastrado com sucesso",
                pedido: novoPedido
            }));
    });
    return;
    };

    //Criação do método PUT

    if ( rota === "/pedidos" && metodo === "PUT"){
        let body = ''; //variavel que armazena os pedaços da requisição
        //ação que será disparada com a requisição para armazenar as partes da requisição dentro da variável body
        
         req.on('data' , parte => {
            body += parte;
         });

         req.on('end', () =>{
            //a variavel dados receberá a tradução do body em objeto JavaScript
            const dados = JSON.parse(body);
            let encontrado = false; //facilitará o servidos a encontrar o id correspondente


            //pedidos está recebendo o mapeamento do array pedidos
            //pedido (no singular) = cada objeto do array
            pedidos = pedidos.map(pedido =>{

                //Comparação de ID para ser possível substituir
                if(pedido.id === dados.id) { 

                    encontrado = true; //Quando localizado, vira true.
                    //Retornará todos os dados de pedidos que não foram alternados + status de cada um deles

                    return {
                        ...pedido,
                        status: dados.status
                    };
                };

                return pedido;
            });

            //Caso o pedido não seja encontrado (exemplo: buscar o id 5, que não existe),
            //será retornado o statusCode 404 e uma mensagem de pedido não encontrado
            if( !encontrado) {
                res.statusCode = 404;
                res.end(JSON.stringify({
                    mensagem:"Pedido não encontrado"
                }));
                return;
            };
            res.end(JSON.stringify({
                mensagem: "Pedido atualizado com sucesso",
                dados:pedidos
            }));
         });
         return;
    };

   // Criação do método DELETE
    if(rota === "/pedidos" && metodo === "DELETE") {
        let body = ''; // variável que armazena os pedaços da requisição
        // ação que será disparada com a requisição para armazenar as partes da requisição dentro da variável body
       
        req.on('data', parte => {
            body += parte;
        });
 
        req.on('end', () => {

            // dados receberá o body traduzido para objeto em JavaScript
            const dados = JSON.parse(body);
 
            // Medirá o tamanho do array antes de o deletar-mos
            const tamanhoAntes = pedidos.length;
 
            // Manterá todos os pedidos que NÃO tem o id informado e removerá os que tem o ID igual ao enviado pela requisição.
            pedidos = pedidos.filter(pedido => pedido.id !== dados.id);
 
            // Fará a comparação de tamanho do array, se os tamanhos estiverem identicos, o pedido não foi localizado para que seja apagado.
            if(pedidos.length === tamanhoAntes) {
                res.statusCode = 404;
                res.end(JSON.stringify({ mensagem: "Pedido não encontrado"}));
                return;
            };
 
            // Reposta final que exibe o pedido removido com sucesso e exibe o array atualizado
            res.end(JSON.stringify({
                mensagem: "Pedido removido",
                dados: pedidos
            }));
        });
        return;
    };

    res.statusCode = 404; //Not Found = Não encontrado
    //resposta para o usúario caso ele busque uma rota inexistente
    res.end (JSON.stringify({
        mensagem: "Página não encontrada"
    }));
});

//Derfinição da porta onde o servidor rodará
    const PORT = process.env.PORT || 3000;

server.listen(PORT , () =>{
    console.log (`Servidor rodando na porta ${PORT}`);
});