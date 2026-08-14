
const supervisor = {
    user: "",
    pass: "",
    rol: "supervisor"
};

const operador = {
    rol: "operador"
};

const categoriasBase = [
    "Bespoke",
    "Diamond",
    "Diamond Seg.",
    "Platinum",
    "Gold",
    "Classic",
    "No socios"
];

let usuarioActual = operador;


// Estos son los datos de arranque que se ven un instante, mientras se
// consulta la base de datos compartida (ver cargarClientesDesdeServidor más abajo).
let clientes = [
    {
        "id": "100003",
        "nombre": "LIN JIAN",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100005",
        "nombre": "GUTIERREZ PAULA GILDA",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100009",
        "nombre": "FELDSTEIN MAXIMILIANO HERNAN",
        "dni": "22333444",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "img/fotos/22333444.jpg",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100010",
        "nombre": "LEE CHIN HAENG",
        "dni": "11222333",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "img/fotos/11222333.jpg",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100015",
        "nombre": "MAOUR SCHAUL VICTOR ARIEL",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100066",
        "nombre": "SUEZ PATRICIA RAQUEL",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100176",
        "nombre": "BROGI PEDRO AUGUSTO",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100183",
        "nombre": "BUJAN SILVIA ALEJANDRA",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100322",
        "nombre": "GIANNITRAPANI SUSANA MARINA",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1093141",
        "nombre": "MARTIN MAXIMILIANO",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1096504",
        "nombre": "PAPADOPULOS LUCIA DEL CARMEN",
        "dni": "09530145-1",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "img/fotos/09530145-1.jpg",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1243243",
        "nombre": "ROCHA MANUEL RAMON",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1331962",
        "nombre": "SOLIMA ALICIA BEATRIZ",
        "dni": "",
        "categoria": "Bespoke",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100006",
        "nombre": "KAMENSKY GUILLERMO OSCAR",
        "dni": "13782297",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100011",
        "nombre": "SCHIANCHI NILDA RAQUEL",
        "dni": "6161951",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100023",
        "nombre": "SA NESTOR ANIBAL",
        "dni": "17606955",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100032",
        "nombre": "ARDITTI RAQUEL BEATRIZ",
        "dni": "4412088",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100047",
        "nombre": "CALVAGNA MARIANO",
        "dni": "30081163",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100049",
        "nombre": "CRESPIN MARINA ANA",
        "dni": "23670286",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100052",
        "nombre": "MINNITI MARIA CARMEN",
        "dni": "11038324",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100056",
        "nombre": "DABAAN LILIANA",
        "dni": "18787980",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100082",
        "nombre": "ORMAZABAL MARIA CECILIA",
        "dni": "29319608",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100095",
        "nombre": "SANCHEZ PAOLO JAVIER HERNAN",
        "dni": "28079442",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100103",
        "nombre": "ROMERO GUILLERMO ALBERTO",
        "dni": "13062758",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100109",
        "nombre": "MANDALAOUI ARLETTE",
        "dni": "18584992",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100112",
        "nombre": "SALOMON JULIO MARIO",
        "dni": "11985585",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100128",
        "nombre": "CAPELUTO GABRIEL JOSE",
        "dni": "17453859",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "img/fotos/17453859.jpg",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100130",
        "nombre": "KULISCH CECCON CARLA",
        "dni": "95313278",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100132",
        "nombre": "ANTONINI JORGE LUIS",
        "dni": "8273307",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100136",
        "nombre": "RUOCCO VERONICA",
        "dni": "17193756",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100146",
        "nombre": "SANABRIA DAVALOS ROSA MABEL",
        "dni": "94596830",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100156",
        "nombre": "PEREZ MARTA ELISA",
        "dni": "13482854",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100173",
        "nombre": "GONZALEZ MARIA DORA",
        "dni": "10463180",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100199",
        "nombre": "BOUSO„O ELIAS ISIDORO",
        "dni": "4357153",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100209",
        "nombre": "BALLINA MARIA SOLEDAD",
        "dni": "23372901",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100252",
        "nombre": "ABADI ELENA JUDITH",
        "dni": "16893888",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100320",
        "nombre": "SERGI MARCELA PATRICIA",
        "dni": "20298192",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100341",
        "nombre": "LAMEIRO MAXIMILIANO",
        "dni": "24235206",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100374",
        "nombre": "GATTI CARLOS FERNANDO",
        "dni": "10087644",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100445",
        "nombre": "MU„OZ ABEL",
        "dni": "16491519",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100545",
        "nombre": "WERBAJH SANTIAGO ENRIQUE",
        "dni": "18299782",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100563",
        "nombre": "ARGONZ DIEGO",
        "dni": "32149380",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100576",
        "nombre": "AROZENA NANCY ROSALIA",
        "dni": "23601601",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "300025",
        "nombre": "PONTIERO ALEJANDRO TOMAS",
        "dni": "12849465",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1036916",
        "nombre": "PARRILLA RUBEN OSVALDO",
        "dni": "14686646",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1048696",
        "nombre": "ETCHART VERONICA",
        "dni": "34318574",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1059276",
        "nombre": "PEIRANO MAURICIO NICOLAS",
        "dni": "24960444",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1094942",
        "nombre": "BENVENUTO DIEGO LUIS",
        "dni": "23087042",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1112088",
        "nombre": "GIL ARROYO JORGE EUGENIO",
        "dni": "32037003",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1129902",
        "nombre": "XUE JINGBIAO",
        "dni": "94997621",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1130258",
        "nombre": "PRUEBA ATC NUEVA",
        "dni": "35267543",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1158081",
        "nombre": "GARCIA MARTIN",
        "dni": "18053202",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1176624",
        "nombre": "GALLI CAROLINA NATALIA",
        "dni": "29902072",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1223650",
        "nombre": "SALA NUEVA",
        "dni": "26545879",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1248738",
        "nombre": "CORA FEDERICO GERMAN",
        "dni": "23926407",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1254054",
        "nombre": "MIGNABURU INES ANA MARIA",
        "dni": "17863514",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1260805",
        "nombre": "MAGLIOLA ANDRES NICOLAS",
        "dni": "30780223",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1322551",
        "nombre": "COSTESSICH LAURA MARIANA",
        "dni": "20861101",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1332642",
        "nombre": "FERNANDEZ CASTA„ON LAURA EUGENIA",
        "dni": "23648842",
        "categoria": "Diamond",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100008",
        "nombre": "PARGAMENT MAXIMO JOSE",
        "dni": "25431938",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100019",
        "nombre": "PORCEL GABRIELA MARIA",
        "dni": "13213121",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100026",
        "nombre": "GLIK MANUEL",
        "dni": "4319745",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100028",
        "nombre": "ZAJIC RODOLFO MARCELO",
        "dni": "13403439",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100029",
        "nombre": "PARI SUSANA MARIA",
        "dni": "11205642",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100031",
        "nombre": "FERRARI JUAN DAVID",
        "dni": "4557932",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100033",
        "nombre": "GALLEGO LEONARDO OSCAR",
        "dni": "22922867",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100035",
        "nombre": "CHALBAUD ANTONIO",
        "dni": "10924170",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100038",
        "nombre": "BERETTA ADRIANA SILVIA",
        "dni": "12966079",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100039",
        "nombre": "MORENO MARIA DEL CARMEN",
        "dni": "6542868",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100041",
        "nombre": "MILANESE GUSTAVO DANTE",
        "dni": "14010348",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100043",
        "nombre": "FELMAN MATIAS LUCAS",
        "dni": "25940359",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100045",
        "nombre": "NARVAEZ ADRIANA HAYDEE",
        "dni": "25784281",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100046",
        "nombre": "VARENNES FLAVIO OSCAR",
        "dni": "14526565",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100048",
        "nombre": "FERNANDEZ EMMANUEL ALBERTO",
        "dni": "32993379",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100050",
        "nombre": "SONDER CARMEN RAQUEL",
        "dni": "10530587",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100051",
        "nombre": "SALA RICARDO GABRIEL",
        "dni": "28387607",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100054",
        "nombre": "ROMANO GUSTAVO",
        "dni": "21436878",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100061",
        "nombre": "SELPA MARIA ANDREA",
        "dni": "14902099",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100062",
        "nombre": "GILIBERTI MIGUEL ANTONIO",
        "dni": "12463615",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100063",
        "nombre": "TAMAYO MARCELO ENRIQUE",
        "dni": "17486598",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100064",
        "nombre": "MARTINEZ IRMA",
        "dni": "10137210",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100065",
        "nombre": "MARTUCCI EDGARDO OSCAR",
        "dni": "11837300",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100067",
        "nombre": "TONANTI ALICIA LUCIA",
        "dni": "5250061",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100076",
        "nombre": "CHOI SAE JEONG",
        "dni": "92755548",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100077",
        "nombre": "JABULIJ ADRIAN MIGUEL",
        "dni": "4380169",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100084",
        "nombre": "ROSSI MARIA PAULA",
        "dni": "25704995",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100087",
        "nombre": "VINZIA RAUL CARLOS",
        "dni": "8480415",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100091",
        "nombre": "MASTELLONE JOSE FABIAN",
        "dni": "16676022",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100093",
        "nombre": "CELANO FABIAN GUSTAVO",
        "dni": "18165348",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100096",
        "nombre": "GUERRA PAMFILO",
        "dni": "12618827",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100100",
        "nombre": "AXELRAD MARCELO GABRIEL",
        "dni": "21483779",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100102",
        "nombre": "LEE HYON GUN",
        "dni": "93554843",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100105",
        "nombre": "PISTONE GUSTAVO ADRIAN",
        "dni": "23992739",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100111",
        "nombre": "LEON ALEJANDRO DANIEL",
        "dni": "14151786",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100113",
        "nombre": "GUIDI EDUARDO ELOY",
        "dni": "16260337",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100115",
        "nombre": "SCHINNEA MARIO",
        "dni": "13805408",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100117",
        "nombre": "ISMACH JAVIER OSCAR",
        "dni": "17861662",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100118",
        "nombre": "LEE YUAN MEI",
        "dni": "18666852",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100123",
        "nombre": "CARITA ALBERTO ANGEL",
        "dni": "10504908",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100125",
        "nombre": "WALTER DANIEL EDUARDO",
        "dni": "14217061",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100127",
        "nombre": "ARZAMENDIA ILDA",
        "dni": "10348569",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100129",
        "nombre": "BRUNO MARIA ROSA",
        "dni": "18693285",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100133",
        "nombre": "MAGARI„OS EDUARDO RAMON",
        "dni": "7739409",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100142",
        "nombre": "TOMINO PABLO",
        "dni": "22149265",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100143",
        "nombre": "CHIANG YA CHING",
        "dni": "18845534",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100148",
        "nombre": "ZUAIN ROSANNA ELIZABETH",
        "dni": "16382964",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100149",
        "nombre": "DABKIEWICZ ROMINA",
        "dni": "25670345",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100150",
        "nombre": "AMOR EDUARDO OSVALDO",
        "dni": "16161644",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100151",
        "nombre": "MAITA QUIROGA URSULA ADELAIDA",
        "dni": "13417660",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100155",
        "nombre": "DEL MEDICO ALEJANDRO GABRIEL",
        "dni": "11644078",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100166",
        "nombre": "MIRAGAYA IGNACIO HUGO",
        "dni": "38324234",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100167",
        "nombre": "MIRAGAYA EDUARDO DANIEL",
        "dni": "11068227",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100168",
        "nombre": "MIRAGAYA AGUSTIN JUAN",
        "dni": "33780282",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100169",
        "nombre": "PICASSO MIRIAM ESTELA",
        "dni": "6695113",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100175",
        "nombre": "FORTTI NORMA BEATRIZ",
        "dni": "10921067",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100177",
        "nombre": "LEMA ELISA MARIA",
        "dni": "21486648",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100181",
        "nombre": "LI XIAOYAN",
        "dni": "94532894",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100182",
        "nombre": "AYERZA EZEQUIEL MARTIN EDUARDO",
        "dni": "10966814",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100185",
        "nombre": "BURCHERI DANIEL EDUARDO",
        "dni": "11842812",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100191",
        "nombre": "OCK KYOUNGMIN",
        "dni": "94246202",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100208",
        "nombre": "GOLDSTEIN ANA ALEJANDRA",
        "dni": "13173425",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100214",
        "nombre": "PELLERANO RICARDO DANIEL",
        "dni": "25705565",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100215",
        "nombre": "ABALSA HUGO ALBERTO",
        "dni": "11528279",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100230",
        "nombre": "LOPEZ VERîNICA MERCEDES",
        "dni": "16130405",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100236",
        "nombre": "PIAGGIO LILIANA MONICA",
        "dni": "16559912",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100275",
        "nombre": "LEVI DAVID ALBERTO",
        "dni": "4398336",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100276",
        "nombre": "AREVALO ANA MARIA",
        "dni": "6052686",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100282",
        "nombre": "BRITO JOSE ANTONIO",
        "dni": "13781937",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100302",
        "nombre": "GRANDE SIBILA CORA",
        "dni": "16130190",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100307",
        "nombre": "DUGATKIN GABRIEL EDUARDO",
        "dni": "13285118",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100309",
        "nombre": "PIOVANO AURORA RAQUEL ELIZABETH",
        "dni": "12549145",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100316",
        "nombre": "COSTOYA ISABEL SUSANA",
        "dni": "11602149",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100332",
        "nombre": "PEDREIRA CARLOS ABEL",
        "dni": "24315580",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100334",
        "nombre": "KAPTAN ANA LAURA",
        "dni": "22849214",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100338",
        "nombre": "YACONIS ENRIQUE ALBERTO",
        "dni": "11266864",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100362",
        "nombre": "GUZMAN JOSE ALBERTO",
        "dni": "8319268",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100364",
        "nombre": "SERGI SILVIA ANDREA",
        "dni": "18095468",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100373",
        "nombre": "GOLTZ ADRIANA CLAUDIA",
        "dni": "14315413",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100381",
        "nombre": "DENG HUI ZHEN",
        "dni": "93277227",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100395",
        "nombre": "REIRIS INSAURRALDE LUCAS NICOLAS",
        "dni": "31316242",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100433",
        "nombre": "KORENFELD BEATRIZ LILIANA",
        "dni": "10789403",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100435",
        "nombre": "BERTRAN MARIA LUISA",
        "dni": "4716364",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100460",
        "nombre": "NEU BERNARDO LUIS",
        "dni": "8400567",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100466",
        "nombre": "LOGGIA CELESTE AIDA",
        "dni": "17513181",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100471",
        "nombre": "MAQUEDA LUISA ESTER",
        "dni": "4775417",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100492",
        "nombre": "SAHYOUN MARIA ISABEL",
        "dni": "22110013",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100495",
        "nombre": "KOVAL ARIEL",
        "dni": "25770861",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100496",
        "nombre": "ZEAITER MARCELA ADRIANA",
        "dni": "18355923",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100500",
        "nombre": "MACIAS DARLENE LILIAN",
        "dni": "11988396",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100502",
        "nombre": "GHILLIONE PABLO ALEJANDRO",
        "dni": "27120887",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "img/fotos/27120887.jpg",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100512",
        "nombre": "SCOMPARIN HAYDEE ZOILA",
        "dni": "10265360",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "100562",
        "nombre": "VIDAL CAMILA",
        "dni": "35078290",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "300024",
        "nombre": "BOISSELIER IRMA NOEMI",
        "dni": "13397057",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "300041",
        "nombre": "NUBILE ALBERTO JOSE",
        "dni": "5090398",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1003908",
        "nombre": "MICHA JOSE DANIEL",
        "dni": "35094364",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1005748",
        "nombre": "GUZMAN JULIO CESAR",
        "dni": "92530760",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1020441",
        "nombre": "BROGGIA FRANCO",
        "dni": "41768576",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1024685",
        "nombre": "GARCIA ESTEBAN MARTIN",
        "dni": "26364451",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1028071",
        "nombre": "CHALELACHUILI AARON",
        "dni": "13411708",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1032519",
        "nombre": "DOMINGUEZ MARIA LUISA",
        "dni": "18405754",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1038132",
        "nombre": "HAN JUNG",
        "dni": "92812564",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1038295",
        "nombre": "ARCHIOPOLI HUGO",
        "dni": "11111301",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1041355",
        "nombre": "RAGO CARLOS",
        "dni": "14189668",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1045894",
        "nombre": "DERKACZ BEATRIZ",
        "dni": "13978366",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1047745",
        "nombre": "BORDES SERGIO ANGEL",
        "dni": "25154136",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1048357",
        "nombre": "BRITEZ MONICA",
        "dni": "21349652",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1051629",
        "nombre": "FAVELUKES ROBERTO SANTIAGO",
        "dni": "22708299",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1053559",
        "nombre": "QUEVEDO MARISOL DANIELA",
        "dni": "23598145",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1053625",
        "nombre": "ALONSO SILVINA ALONSO",
        "dni": "16038000",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1055337",
        "nombre": "KAPUSI MIRIAM TERESA",
        "dni": "17513036",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1059175",
        "nombre": "MASTELLONE PABLO GABRIEL",
        "dni": "20028212",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1068503",
        "nombre": "TOURI„O ANDREA RAQUEL",
        "dni": "20011847",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1087112",
        "nombre": "FERNANDEZ JUAN MARIA",
        "dni": "22570443",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1088279",
        "nombre": "GAO GUANGZHE",
        "dni": "94011627",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1090531",
        "nombre": "IVOR SERGIO ALBERTO",
        "dni": "12204292",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1090602",
        "nombre": "DOLZ MARIA CLARA",
        "dni": "16976837",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1092367",
        "nombre": "DE GENNARO AUGUSTO",
        "dni": "36829583",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1095955",
        "nombre": "ZAPUTOVICH MARTIN FERNANDO",
        "dni": "24646709",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1096372",
        "nombre": "AHUMADA MARIA",
        "dni": "47184096",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1100930",
        "nombre": "VENTIMIGLIA ELIZABETH",
        "dni": "27593407",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1101476",
        "nombre": "MEDINA GUSTAVO HORACIO",
        "dni": "17364763",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1109623",
        "nombre": "CABRAL VICTORIA MERCEDES",
        "dni": "18216168",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1111422",
        "nombre": "ROMERO LAMAS ESTEBAN",
        "dni": "13277116",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1113493",
        "nombre": "PROTZER SONIA BEATRIZ",
        "dni": "26623369",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1114121",
        "nombre": "FOLGUERAL NORMA BEATRIZ",
        "dni": "16376236",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1117559",
        "nombre": "VERA FLORES IGOR ALFREDO",
        "dni": "95902694",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1135977",
        "nombre": "KALIEROF INES LEONOR",
        "dni": "14231048",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1137486",
        "nombre": "LLERMANOS DANIEL HUGO",
        "dni": "10671650",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1139644",
        "nombre": "FONTANA GUILLERMO ESTEBAN",
        "dni": "17407811",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1140175",
        "nombre": "BOGADO JUAN MANUEL",
        "dni": "22808738",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1143506",
        "nombre": "HUANG QIXIN",
        "dni": "94028847",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1146559",
        "nombre": "NU„EZ CELIA CAROLINA",
        "dni": "5198751",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1148230",
        "nombre": "SOMMARO FERNANDO",
        "dni": "27257898",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1148896",
        "nombre": "NOVELO OSUNA LUIS ALBERTO",
        "dni": "22492058",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1149665",
        "nombre": "BRITHET HORACIO",
        "dni": "10962554",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1155591",
        "nombre": "SOSA DE MORENO MARIA CRISTINA SOSA DE MORENO",
        "dni": "1104700",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1160276",
        "nombre": "INCARDONA JUAN DIEGO",
        "dni": "22366248",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1162142",
        "nombre": "GARCIA COSTERO JUAN PABLO",
        "dni": "29248804",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1166689",
        "nombre": "RECAYTE LLANTADA GRACIELA BEATRIZ",
        "dni": "5612900",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1169147",
        "nombre": "GIANNETTASIO FERNANDO ADRIAN",
        "dni": "23768366",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1182053",
        "nombre": "YAMAN JOSE MIGUEL YAMAN",
        "dni": "8354322",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1182361",
        "nombre": "KERNER EDUARDO",
        "dni": "12945690",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1194369",
        "nombre": "DEGREGORIO MARCELO ALEJANDRO",
        "dni": "14194651",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1198079",
        "nombre": "CARDOZO DIEGO OSCAR",
        "dni": "29009046",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1198622",
        "nombre": "SOSA CARLOS ALBERTO SOSA",
        "dni": "17318961",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1200818",
        "nombre": "DOMBROWSKI LIZA MARIA",
        "dni": "32344295",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1202591",
        "nombre": "PALERMO DANIEL JOSE",
        "dni": "23446822",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1216572",
        "nombre": "MARQUEZ PESOA RAUL",
        "dni": "14745697",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1217536",
        "nombre": "CLAPS NORBERTO JOSE",
        "dni": "14887424",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1219913",
        "nombre": "MU„OZ RICARDO",
        "dni": "14565019",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1220547",
        "nombre": "CELESTE MARIA ISOLINA",
        "dni": "5315651",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1220706",
        "nombre": "MEJIAS ENRIQUE IGNACIO",
        "dni": "22981854",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1227156",
        "nombre": "SIERRA FEDERICO LUIS",
        "dni": "34117611",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1228032",
        "nombre": "SARQUIS EDUARDO EZEQUIEL CEFERINO",
        "dni": "25570552",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1235519",
        "nombre": "SCHELLINO AHUMADA DAIANA CAROLINA",
        "dni": "36080886",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1236120",
        "nombre": "SERANTONI PABLO MARCELO",
        "dni": "23553964",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1247489",
        "nombre": "MAJDALANI SILVIA CRISTINA",
        "dni": "13296836",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1252305",
        "nombre": "SANTA CRUZ JULIAN BENITO",
        "dni": "11634988",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1253934",
        "nombre": "MAZZOCCONE DORA INES",
        "dni": "20405709",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1255554",
        "nombre": "SEO JUNG SOOK",
        "dni": "93280480",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1263374",
        "nombre": "QUINTANA FRANCO EMANUEL",
        "dni": "42194278",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1268351",
        "nombre": "SEQUEIRA OSVALDO",
        "dni": "35582560",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1274904",
        "nombre": "RAGGIO ANDREA ELISABET",
        "dni": "23481218",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1275993",
        "nombre": "YOMHA CLAUDIO NALLIV",
        "dni": "21891652",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1276060",
        "nombre": "CHUN BENJAMIN DEE HYUN",
        "dni": "93794702",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1276524",
        "nombre": "FREIRE MARIANO ROQUE",
        "dni": "18565089",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1286978",
        "nombre": "BERGEROT LUJAN",
        "dni": "28626605",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1288552",
        "nombre": "FERRARA TONINO",
        "dni": "93194888",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1290935",
        "nombre": "IMBERTI OSCAR AMERICO CAYETANO",
        "dni": "8276710",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1291420",
        "nombre": "IBA„EZ MERCEDES",
        "dni": "12616488",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1292179",
        "nombre": "PEDACE JORGE LUIS",
        "dni": "11386710",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1298450",
        "nombre": "DE SOUZA DANIELA MAYRA",
        "dni": "13704222",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1300404",
        "nombre": "FUNGUEIRO CARLOS",
        "dni": "24061986",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1304542",
        "nombre": "BALEZTENA WALTER SEBASTIAN",
        "dni": "21478194",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1305217",
        "nombre": "ROMERO NEBY YANET",
        "dni": "34617278",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1319369",
        "nombre": "GALGANO GUILLERMO CESAR",
        "dni": "17332416",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1319940",
        "nombre": "ZHENG QUNXING",
        "dni": "94031369",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1340137",
        "nombre": "PEYROUTON ALAN",
        "dni": "69340785",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    },
    {
        "id": "1344740",
        "nombre": "MARTINEZ ALICIA",
        "dni": "11488698",
        "categoria": "Diamond Seg.",
        "tarjeta": "",
        "foto": "",
        "acompanantes": [],
        "enVip": false,
        "historial": [],
        "novedades": []
    }
];

clientes.forEach(cliente => {

    if (!cliente.acompanantes) {

        cliente.acompanantes = [];

        if (cliente.acompanante) {
            cliente.acompanantes.push(cliente.acompanante);
        }
    }

});

let formIngreso = {
    activo: false,

    nombre: "",
    dni: "",
    email: "",
    celular: "",
    categoria: "",
    tarjeta: "",
    foto: "",

    pesos: false,
    dolares: false
};



const formulario = document.getElementById("form-busqueda");
const buscador = document.getElementById("buscador");
const resultadoCliente = document.getElementById("resultado-cliente");
const panelDinamico = document.getElementById("panel-dinamico");
const panelEstadisticas = document.getElementById("panel-estadisticas");

// =====================
// SUGERENCIAS EN VIVO DEL BUSCADOR
// =====================

const estilosSugerencias = document.createElement("style");
estilosSugerencias.textContent = `
    .contenedor-sugerencias {
        position: relative;
    }
    #lista-sugerencias {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 1000;
        background: #1a1a1a;
        border: 1.5px solid #daa520;
        border-top: none;
        border-radius: 0 0 10px 10px;
        max-height: 260px;
        overflow-y: auto;
        display: none;
    }
    #lista-sugerencias .item-sugerencia {
        padding: 8px 14px;
        cursor: pointer;
        color: #f0f0f0;
        border-bottom: 1px solid #2a2a2a;
        font-size: 14px;
    }
    #lista-sugerencias .item-sugerencia:last-child {
        border-bottom: none;
    }
    #lista-sugerencias .item-sugerencia:hover,
    #lista-sugerencias .item-sugerencia.activa {
        background: rgba(218, 165, 32, 0.15);
    }
    #lista-sugerencias .item-sugerencia .dato-secundario {
        color: #999;
        font-size: 12px;
    }
`;
estilosSugerencias.textContent += `
    .acomp-toolbar {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 10px;
        margin-bottom: 14px;
    }
    .btn-agregar-acomp {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 20px;
        border-radius: 999px;
        border: 1.5px solid #daa520;
        background: transparent;
        color: #daa520;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
    }
    .btn-agregar-acomp:hover {
        background: #daa520;
        color: #1a1a1a;
    }
    .lista-acompanantes {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: 100%;
    }
`;
estilosSugerencias.textContent += `
    .overlay-categoria-fondo {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .overlay-categoria-card {
        background: #111;
        border: 2px solid #daa520;
        border-radius: 16px;
        padding: 20px;
        width: 360px;
        max-width: 90%;
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .overlay-categoria-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #daa520;
    }
    .overlay-categoria-card .lista-categoria {
        overflow-y: auto;
    }
`;
estilosSugerencias.textContent += `
    .icon-btn:hover {
        background: #daa520 !important;
        color: #1a1a1a !important;
        box-shadow: 0 0 10px rgba(218,165,32,0.5) !important;
        transform: scale(1.05) !important;
    }
    .icon-btn:hover i {
        color: #1a1a1a !important;
    }
    .icon-btn img {
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 50%;
    }
    .fotos,
    #preview-acomp,
    .acompanante-item img,
    .ficha-cliente img {
        aspect-ratio: 1 / 1 !important;
        object-fit: cover !important;
        border-radius: 50% !important;
    }
    .btn-accion-principal {
        background: transparent !important;
        border: 1.5px solid #daa520 !important;
        color: #daa520 !important;
        border-radius: 10px !important;
        padding: 10px 18px !important;
        font-weight: 600 !important;
        white-space: nowrap !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        width: auto !important;
        min-width: 0 !important;
        transition: background 0.2s, color 0.2s !important;
    }
    .btn-accion-principal:hover {
        background: #daa520 !important;
        color: #1a1a1a !important;
    }
`;
document.head.appendChild(estilosSugerencias);

// Envolvemos el input del buscador en un contenedor propio para poder
// posicionar la lista de sugerencias justo debajo, sin tocar el HTML.
const contenedorSugerencias = document.createElement("div");
contenedorSugerencias.className = "contenedor-sugerencias";
buscador.parentNode.insertBefore(contenedorSugerencias, buscador);
contenedorSugerencias.appendChild(buscador);

const listaSugerencias = document.createElement("div");
listaSugerencias.id = "lista-sugerencias";
contenedorSugerencias.appendChild(listaSugerencias);

function normalizarTexto(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function textoBusquedaCliente(cliente) {
    return normalizarTexto(`
        ${cliente.nombre}
        ${cliente.dni}
        ${cliente.id}
        ${cliente.tarjeta}
    `);
}

function ocultarSugerencias() {
    listaSugerencias.style.display = "none";
    listaSugerencias.innerHTML = "";
}

function seleccionarClienteDesdeSugerencia(cliente) {
    clienteActual = cliente;
    vistaActual = "historial";
    cambiarVista("cliente");

    buscador.value = "";
    ocultarSugerencias();
}

buscador.addEventListener("input", function () {

    const termino = normalizarTexto(buscador.value);

    if (!termino) {
        ocultarSugerencias();
        return;
    }

    const coincidencias = clientes
        .filter(cliente => textoBusquedaCliente(cliente).includes(termino))
        .slice(0, 8);

    if (coincidencias.length === 0) {
        listaSugerencias.innerHTML = `<div class="item-sugerencia dato-secundario">Sin coincidencias</div>`;
        listaSugerencias.style.display = "block";
        return;
    }

    listaSugerencias.innerHTML = coincidencias.map(cliente => `
        <div class="item-sugerencia" data-id="${cliente.id}">
            ${cliente.nombre}
            <div class="dato-secundario">
                DNI: ${cliente.dni || "-"} · Tarjeta: ${cliente.tarjeta || "-"} · ${cliente.categoria || ""}
            </div>
        </div>
    `).join("");

    listaSugerencias.style.display = "block";
});

listaSugerencias.addEventListener("click", function (e) {
    const item = e.target.closest(".item-sugerencia[data-id]");
    if (!item) return;

    const cliente = clientes.find(c => String(c.id) === item.dataset.id);
    if (cliente) seleccionarClienteDesdeSugerencia(cliente);
});

document.addEventListener("click", function (e) {
    if (!contenedorSugerencias.contains(e.target)) {
        ocultarSugerencias();
    }
});

buscador.addEventListener("keydown", function (e) {
    if (e.key === "Escape") ocultarSugerencias();
});
const btnMetricas = document.getElementById("btn-metricas");

btnMetricas.addEventListener("click", () => {

    vistaActual = "metricas";

    resultadoCliente.style.display = "none";
    panelEstadisticas.style.display = "block";

    cambiarVista("metricas");

    renderEstadisticas();
});


document.getElementById("fechaDesde")
    .addEventListener("change", () => {

        panelEstadisticas.style.display = "block";
        resultadoCliente.style.display = "none";

        renderEstadisticas();
    });

document.getElementById("fechaHasta")
    .addEventListener("change", () => {

        panelEstadisticas.style.display = "block";
        resultadoCliente.style.display = "none";

        renderEstadisticas();
    });

const panelNuevo = document.getElementById("panel-nuevo");
const btnNuevo = document.getElementById("btn-nuevo");
const btnSupervisor = document.getElementById("btn-supervisor");
const btnLogout = document.getElementById("btn-logout");
const panelAdmin = document.getElementById("panel-admin");
const anioMinimo = 2026;
const mesMinimoPorAnio = 6;


let clienteActual = null;
let vistaActual = "historial";
let modoCrearNovedad = false;
let historialDesde = "";
let historialHasta = "";
let mesHistorialSeleccionado = "06";

let categoriaExpandida = null;
let acompananteEditIndex = null;

let accionPendiente = null;
let novedadSeleccionada = null;
let indexNovedadSeleccionada = null;
let modoEdicionNovedad = false;


function getEnSalaAhora() {

    const resultado = {
        total: 0,
        acompanantes: 0,
        categorias: {}
    };

    categoriasBase.forEach(cat => {
        resultado.categorias[cat] = 0;
    });

    clientes.forEach(cliente => {

        if (!cliente.enVip) return;

        resultado.total++;

        if (cliente.acompanante?.ingresa) {
            resultado.acompanantes++;
        }

        const categoria = cliente.categoria;

        if (resultado.categorias.hasOwnProperty(categoria)) {
            resultado.categorias[categoria]++;
        } else {
            resultado.categorias["No socios"]++;
        }
    });

    return resultado;
}

function getClientesEnSalaPorCategoria() {

    const resultado = {};

    categoriasBase.forEach(cat => {
        resultado[cat] = [];
    });

    resultado["No socios"] = [];

    clientes.forEach(cliente => {

        if (!cliente.enVip) return;

        const categoria =
            cliente.categoria || "No socios";

        if (!resultado[categoria]) {
            resultado[categoria] = [];
        }

        resultado[categoria].push({
            id: cliente.id,
            nombre: cliente.nombre,
            apellido: cliente.apellido
        });
    });

    return resultado;
}

function iniciarApp() {
    volverInicio();
}

iniciarApp();



function guardarClientes() {
    fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientes)
    }).catch(error => {
        console.error("No se pudo guardar en la base de datos compartida:", error);
    });
}

async function cargarClientesDesdeServidor() {
    try {
        const respuesta = await fetch("/api/clientes");
        const datos = await respuesta.json();

        if (Array.isArray(datos) && datos.length > 0) {
            // Ya hay datos guardados en la base compartida: los usamos.
            clientes = datos;
        } else {
            // La base todavía está vacía (primera vez): la sembramos
            // con los clientes que ya veníamos usando de arranque.
            guardarClientes();
        }

    } catch (error) {
        console.error("No se pudo conectar con la base de datos compartida, se sigue usando la copia local:", error);
    } finally {
        // Si hay un formulario de alta/edición abierto, no lo pisamos con un
        // refresco automático — solo actualizamos la campana de alertas.
        const hayFormularioAbierto = panelNuevo && panelNuevo.innerHTML.trim() !== "";

        if (!hayFormularioAbierto && typeof renderPanel === "function") {
            renderPanel();
        }

        if (typeof renderCampanaAlertas === "function") renderCampanaAlertas();
    }
}

cargarClientesDesdeServidor();

// Cada 30 segundos volvemos a consultar la base compartida, así el
// supervisor ve alertas nuevas generadas por otra persona sin recargar.
setInterval(cargarClientesDesdeServidor, 30000);

function abrirModalConfirmacion(titulo, mensaje, callback) {

    const modal = document.getElementById("modal-confirmacion");
    const tituloEl = document.getElementById("modal-titulo");
    const textoEl = document.getElementById("modal-texto");
    const btnSi = document.getElementById("btn-modal-confirmar");
    const btnNo = document.getElementById("btn-modal-cancelar");

    tituloEl.textContent = titulo;
    textoEl.textContent = mensaje;

    modal.classList.remove("oculto");

    const cb = callback;

    btnSi.onclick = () => {
        modal.classList.add("oculto");
        btnSi.onclick = null;
        btnNo.onclick = null;
        modal.onclick = null;
        if (cb) cb(true);
    };

    btnNo.onclick = () => {
        modal.classList.add("oculto");
        btnSi.onclick = null;
        btnNo.onclick = null;
        modal.onclick = null;
        if (cb) cb(false);
    };

    modal.onclick = (e) => {
        if (e.target !== modal) return;
        modal.classList.add("oculto");
        btnSi.onclick = null;
        btnNo.onclick = null;
        modal.onclick = null;
        if (cb) cb(false);
    };
}


function actualizarVistaUsuario() {

    const panelAdmin = document.getElementById("panel-admin");
    const btnLogout = document.getElementById("btn-logout");
    const btnSupervisor = document.getElementById("btn-supervisor");
    const controlesHistorico = document.getElementById("controles-historico");

    if (!panelAdmin || !btnLogout || !controlesHistorico) return;

    // El botón de métricas tiene que verse para cualquier rol, y además
    // ubicado justo al lado del botón de "Nuevo ingreso" (en ese orden).
    if (btnMetricas && btnNuevo && btnMetricas.previousElementSibling !== btnNuevo) {
        btnNuevo.parentNode.insertBefore(btnMetricas, btnNuevo.nextSibling);
    }
    if (btnMetricas) btnMetricas.style.display = "inline-flex";

    // "Lavados del día" ahora vive como ítem del menú "Informe" en el HTML
    // (junto a Métricas), dentro de #panel-admin -> ya queda oculto solo
    // para quien no sea supervisor, sin que haga falta código extra acá.
    const btnLavadosDia = document.getElementById("btn-lavados-dia");
    if (btnLavadosDia && !btnLavadosDia.dataset.conectado) {
        btnLavadosDia.addEventListener("click", abrirLavadosDelDia);
        btnLavadosDia.dataset.conectado = "true";
    }

    // Buscar / Nuevo ingreso / Métricas: mismo formato visual.
    const btnBuscar = formulario?.querySelector("button[type='submit'], button");
    [btnBuscar, btnNuevo, btnMetricas].forEach(btn => {
        if (btn) btn.classList.add("btn-accion-principal");
    });

    // "Nuevo Ingreso" en una sola línea, por si el HTML trae un <br> forzado.
    if (btnNuevo) {
        btnNuevo.innerHTML = btnNuevo.textContent.trim().replace(/\s+/g, " ");
    }

    // Campana de alertas: se crea una sola vez, junto al botón de logout.
    let campanaContenedor = document.getElementById("campana-alertas-contenedor");
    if (!campanaContenedor && btnLogout) {
        campanaContenedor = document.createElement("span");
        campanaContenedor.id = "campana-alertas-contenedor";
        btnLogout.parentNode.insertBefore(campanaContenedor, btnLogout);
    }

    if (usuarioActual.rol === "supervisor") {

        panelAdmin.style.display = "block";

        if (btnSupervisor) {
            btnSupervisor.style.display = "none";
        }

        btnLogout.style.display = "block";

        // "Nuevo Ingreso" es tarea del operador, el supervisor no lo necesita.
        if (btnNuevo) btnNuevo.style.display = "none";

    } else {

        panelAdmin.style.display = "none";

        if (btnSupervisor) {
            btnSupervisor.style.display = "block";
        }

        btnLogout.style.display = "none";

        if (btnNuevo) btnNuevo.style.display = "inline-flex";
    }

    renderCampanaAlertas();

    // Los calendarios solo se muestran dentro de la vista de métricas
    // (eso lo controla cambiarVista); acá los ocultamos por defecto.
    controlesHistorico.style.display = "none";
}


//CATEGORIAS PARA METRICAS//

function getMetricasCategoria() {

    const categorias = {};

    clientes.forEach(c => {
        categorias[c.categoria] = (categorias[c.categoria] || 0) + 1;
    });

    return categorias;
}

function calcularMovimientosPorHora(historial) {

    const movimientos = {};

    historial.forEach(evento => {

        const e = normalizarEvento(evento);
        if (!e) return;

        const fecha = new Date(e.fecha);
        const hora = fecha.getHours();

        if (!movimientos[hora]) {
            movimientos[hora] = {
                hora,
                ingresos: 0,
                egresos: 0
            };
        }

        if (e.tipo === "INGRESO") {
            movimientos[hora].ingresos++;
        }

        if (e.tipo === "EGRESO") {
            movimientos[hora].egresos++;
        }
    });

    return Object.values(movimientos)
        .sort((a, b) => a.hora - b.hora);
}


function getFlujoOperativo(clientes) {

    let ingresosSocios = 0;
    let ingresosAcompanantes = 0;
    let egresosSocios = 0;
    let egresosAcompanantes = 0;

    clientes.forEach(c => {

        if (!c.historial) return;

        c.historial.forEach(evento => {

            if (evento.tipo === "INGRESO") {
                ingresosSocios++;
            }

            if (evento.tipo === "EGRESO") {
                egresosSocios++;
            }

            if (evento.tipo === "INGRESO") {
                ingresosAcompanantes++;
            }

            if (evento.tipo === "EGRESO") {
                egresosAcompanantes++;
            }
        });
    });

    return {
        ingresosSocios,
        ingresosAcompanantes,
        egresosSocios,
        egresosAcompanantes
    };
}


function getMovimientosHoy() {

    let ingresos = 0;
    let egresos = 0;

    const ingresosCategoria = {};
    const egresosCategoria = {};

    const hoy = new Date().toDateString();

    clientes.forEach(cliente => {

        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));

            if (isNaN(fecha.getTime())) return;

            if (fecha.toDateString() !== hoy) return;

            const categoria = cliente.categoria || "Sin categoría";

            if (mov.tipo?.includes("INGRESO")) {

                ingresos++;

                ingresosCategoria[categoria] =
                    (ingresosCategoria[categoria] || 0) + 1;
            }

            if (
                mov.tipo?.includes("EGRESO") ||
                mov.tipo?.includes("SALIO")
            ) {

                egresos++;

                egresosCategoria[categoria] =
                    (egresosCategoria[categoria] || 0) + 1;
            }
        });

    });

    return {
        ingresos,
        egresos,
        ingresosCategoria,
        egresosCategoria
    };

}

function getFechaOperativa(fecha) {
    const f = new Date(fecha);
    if (f.getHours() < 6) {
        f.setDate(f.getDate() - 1);
    }
    f.setHours(0, 0, 0, 0);
    return f;
}

function getMovimientoDiarioPorCategoria() {

    const resultado = {};

    categoriasBase.forEach(cat => {
        resultado[cat] = {
            ingresos: 0,
            egresos: 0
        };
    });

    const jornadaActual = getFechaOperativa(new Date()).getTime();

    clientes.forEach(cliente => {

        const categoria = cliente.categoria || "No socios";

        (cliente.historial || []).forEach(evento => {

            const e = normalizarEvento(evento);
            if (!e) return;

            const fecha = new Date(e.fecha);

            if (isNaN(fecha.getTime())) return;

            // Jornada operativa 06:00 -> 06:00: solo contamos lo que
            // pasó dentro de la jornada de HOY, no el historial entero.
            if (getFechaOperativa(fecha).getTime() !== jornadaActual) return;

            if (!resultado[categoria]) {
                resultado[categoria] = {
                    ingresos: 0,
                    egresos: 0
                };
            }

            if (e.tipo === "INGRESO") {
                resultado[categoria].ingresos++;
            }

            if (e.tipo === "EGRESO") {
                resultado[categoria].egresos++;
            }

        });
    });

    return resultado;
}



function getMetricasTurno() {

    let manana = 0;
    let tarde = 0;
    let noche = 0;

    clientes.forEach(cliente => {
        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const hora = fecha.getHours();

            if (hora >= 6 && hora <= 13) manana++;
            else if (hora >= 14 && hora <= 20) tarde++;
            else noche++;
        });
    });

    return { manana, tarde, noche };
}


function getActividadPorHora(lista = clientes) {

    const horas = Array(24).fill(0);

    lista.forEach(cliente => {
        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const hora = fecha.getHours();
            horas[hora]++;
        });
    });

    return horas;
}


function getMovimientosFiltradosPorFecha(lista = clientes) {

    const desde = document.getElementById("fechaDesde").value;
    const hasta = document.getElementById("fechaHasta").value;

    if (!desde || !hasta) {

        return lista.flatMap(c =>
            (c.historial || []).map(mov => ({
                ...mov,
                clienteId: c.id,
                categoria: c.categoria
            }))
        );
    }

    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);

    let movimientos = [];

    lista.forEach(cliente => {
        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            if (fecha >= fechaDesde && fecha <= fechaHasta) {
                movimientos.push({
                    ...mov,
                    clienteId: cliente.id,
                    categoria: cliente.categoria
                });
            }
        });
    });

    return movimientos;
}


function getClientesPorHoraCategoria(lista = clientes) {

    const resultado = {};

    lista.forEach(cliente => {

        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const hora = fecha.getHours();
            const categoria = cliente.categoria || "Sin categoría";

            if (!resultado[hora]) {
                resultado[hora] = {};
            }

            resultado[hora][categoria] =
                (resultado[hora][categoria] || 0) + 1;
        });
    });

    return resultado;
}



//PANELES DE CONTROL//

// =====================
// FIX COMPATIBILIDAD UI
// =====================


function seleccionarCategoria(cat) {
    toggleCategoria(cat);
}

// =====================
// FIX SEGURIDAD RENDER METRICAS
// =====================

function safeNumber(n) {
    return isNaN(n) || !isFinite(n) ? 0 : n;
}

// =====================
// FIX getClientesEnSalaPorCategoria
// =====================

function getClientesEnSalaPorCategoria() {

    const resultado = {};

    categoriasBase.forEach(cat => {
        resultado[cat] = [];
    });

    resultado["No socios"] = [];

    clientes.forEach(cliente => {

        if (!cliente.enVip) return;

        const categoria = cliente.categoria || "No socios";

        if (!resultado[categoria]) {
            resultado[categoria] = [];
        }

        resultado[categoria].push({
            id: cliente.id,
            nombre: cliente.nombre,
            apellido: cliente.apellido || ""
        });
    });

    return resultado;
}

// =====================
// FIX RENDER ESTADISTICAS
// =====================

function renderEstadisticas() {

    if (!panelEstadisticas) return;

    const clientesFiltrados = getClientesFiltradosPorFecha();

    const enSala = getEnSalaAhora();
    const clientesEnSala = getClientesEnSalaPorCategoria();

    const movimientoDiario = getMovimientoDiarioPorCategoria();
    const cruce = getMetricasCruce(clientesFiltrados);

    const horas = getActividadPorHora(clientesFiltrados || []);

    const maxHora = safeNumber(Math.max(...horas, 1));

    panelEstadisticas.innerHTML = `

<div class="dashboard">

    <!-- EN SALA -->
    <div class="card metric-card full">
        <h5>EN SALA AHORA</h5>

        <div class="fila-cruce">
            <strong>Socios</strong>
            <span>${enSala.total}</span>
        </div>

        <div class="fila-cruce">
            <strong>Acompañantes</strong>
            <span>${enSala.acompanantes}</span>
        </div>

        <hr>
        

        ${Object.entries(enSala.categorias || {}).map(([cat, total]) => `
            <div class="fila-cruce categoria-click ${categoriaExpandida === cat ? "categoria-activa" : ""}"
    onclick="toggleCategoria('${cat}')">
    <strong>${cat}</strong>
    <span>${total}</span>
</div>
        `).join("")}
    </div>

    <!-- MOVIMIENTO DIARIO -->
    <div class="card metric-card">
        <h5>MOVIMIENTO DIARIO</h5>
        <small>Jornada 06:00 hs → 06:00 hs</small>
        <hr>

        <div class="fila-cruce encabezado">
            <strong>Categoría</strong>
            <span>Ingreso</span>
            <span>Egreso</span>
        </div>

        ${Object.entries(movimientoDiario || {}).map(([categoria, datos]) => `
            <div class="fila-cruce">
                <strong>${categoria}</strong>
                <span>${datos.ingresos}</span>
                <span>${datos.egresos}</span>
            </div>
        `).join("")}
    </div>


<!-- CRUCE -->
<div class="card metric-card full">
    <h5>CATEGORÍA × TURNO</h5>

    <div class="fila-cruce encabezado">
        <strong>Categoría</strong>
        <span>M</span>
        <span>T</span>
        <span>N</span>
    </div>

    ${Object.entries(cruce || {}).map(([categoria, valores]) => `
        <div class="fila-cruce">
            <strong>${categoria}</strong>
            <span>${valores.manana}</span>
            <span>${valores.tarde}</span>
            <span>${valores.noche}</span>
        </div>
    `).join("")}
</div>

<!-- GRAFICO -->
<div class="card metric-card grafico-principal">
    <h5>ACTIVIDAD POR HORA</h5>

    <div class="chart">
        ${(horas || []).map((h, i) => `
            <div class="bar">
                <div class="fill" style="height:${(safeNumber(h) / maxHora) * 100}px"></div>
                <small>${i}</small>
            </div>
        `).join("")}
    </div>
</div>
</div>
`;

    renderOverlayCategoria(clientesEnSala);
}

function renderOverlayCategoria(clientesEnSala) {

    let overlay = document.getElementById("overlay-categoria");

    if (!categoriaExpandida) {
        if (overlay) overlay.remove();
        return;
    }

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "overlay-categoria";
        overlay.className = "overlay-categoria-fondo";
        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                categoriaExpandida = null;
                renderEstadisticas();
            }
        });
    }

    const lista = (clientesEnSala[categoriaExpandida] || []).filter(c => c && c.nombre);

    overlay.innerHTML = `
        <div class="overlay-categoria-card">
            <div class="overlay-categoria-header">
                <strong>${categoriaExpandida} en sala (${lista.length})</strong>
                <button type="button" id="cerrar-overlay-categoria" class="icon-btn">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="lista-categoria">
                ${lista.length === 0
            ? `<div class="text-muted" style="text-align:center;">No hay clientes de esta categoría en sala</div>`
            : lista.map(cliente => `
                        <div class="cliente-en-sala"
                            onclick="abrirCliente('${cliente.id}')"
                            style="cursor:pointer;">
                            ${cliente.nombre || ""} ${cliente.apellido || ""}
                        </div>
                    `).join("")}
            </div>
        </div>
    `;

    document.getElementById("cerrar-overlay-categoria").addEventListener("click", function () {
        categoriaExpandida = null;
        renderEstadisticas();
    });
}

function getMetricasCruce(lista = clientes) {

    const metricas = {

        "Bespoke": { manana: 0, tarde: 0, noche: 0 },
        "Diamond": { manana: 0, tarde: 0, noche: 0 },
        "Diamond Seg.": { manana: 0, tarde: 0, noche: 0 },
        "Platinum": { manana: 0, tarde: 0, noche: 0 },
        "Gold": { manana: 0, tarde: 0, noche: 0 },
        "Classic": { manana: 0, tarde: 0, noche: 0 },
        "No socios": { manana: 0, tarde: 0, noche: 0 }
    };

    const desdeInput = document.getElementById("fechaDesde")?.value;
    const hastaInput = document.getElementById("fechaHasta")?.value;

    let fechaDesde = null;
    let fechaHasta = null;

    if (desdeInput && hastaInput) {
        fechaDesde = new Date(desdeInput);
        fechaHasta = new Date(hastaInput);
        fechaHasta.setHours(23, 59, 59, 999);
    }

    lista.forEach(cliente => {

        const categoria = cliente.categoria || "Sin categoría";

        if (!metricas[categoria]) {
            metricas[categoria] = { manana: 0, tarde: 0, noche: 0 };
        }

        (cliente.historial || []).forEach(registro => {

            const e = normalizarEvento(registro);
            if (!e || e.tipo !== "INGRESO") return;

            const fecha = new Date(Number(e.fecha));
            if (isNaN(fecha.getTime())) return;

            if (fechaDesde && (fecha < fechaDesde || fecha > fechaHasta)) return;

            const hora = fecha.getHours();
            let turno;

            if (hora >= 6 && hora <= 13) turno = "manana";
            else if (hora >= 14 && hora <= 20) turno = "tarde";
            else turno = "noche";

            metricas[categoria][turno]++;
        });
    });

    return metricas;
}

function getMetricasPorDia(lista = clientes) {

    const dias = {};

    lista.forEach(cliente => {
        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const dia = fecha.toISOString().split("T")[0]; // YYYY-MM-DD

            dias[dia] = (dias[dia] || 0) + 1;
        });
    });

    return dias;
}



//FRANJAS HORARIAS//

function obtenerFranja(fechaTexto) {

    const fecha = new Date(fechaTexto);

    if (isNaN(fecha)) return;

    const hora = fecha.getHours();

    if (hora >= 6 && hora <= 13) return "Mañana";
    if (hora >= 14 && hora <= 20) return "Tarde";

    return "Noche";
}

function getMetricasPorMes(lista = clientes) {

    const meses = {};

    lista.forEach(cliente => {

        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const mes =
                `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;

            meses[mes] = (meses[mes] || 0) + 1;
        });
    });

    return meses;
}

//ESTADISTICAS FILTRADAS//

function renderEstadisticasFiltradas(lista) {

    const total = lista.length;
    const enVip = lista.filter(c => c.enVip).length;

    panelEstadisticas.innerHTML = `
        <div class="card p-3">
            <h5>ESTADÍSTICAS FILTRADAS</h5>
            <p>Total: ${total}</p>
            <p>En VIP: ${enVip}</p>
        </div>
    `;
}

function getClientesFiltradosPorFecha() {

    const desde = document.getElementById("fechaDesde").value;
    const hasta = document.getElementById("fechaHasta").value;

    if (!desde || !hasta) return clientes;

    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);

    fechaHasta.setHours(23, 59, 59, 999);

    const resultado = clientes.filter(cliente =>
        cliente.historial?.some(registro => {

            const fecha = new Date(Number(registro.fecha));

            return fecha >= fechaDesde &&
                fecha <= fechaHasta;
        })
    );


    return resultado;
}



// BUSCADOR//


formulario.addEventListener("submit", function (e) {

    e.preventDefault();

    const valor = buscador.value.trim().toLowerCase();

    if (!valor) return;

    const resultados = clientes.filter(cliente => {

        const normalizar = (texto) =>
            String(texto || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();

        const termino = normalizar(valor);

        const textoBusqueda = normalizar(`
    ${cliente.nombre}
    ${cliente.dni}
    ${cliente.id}
    ${cliente.tarjeta}
`);

        return textoBusqueda.includes(termino);
    });

    if (resultados.length === 1) {

        clienteActual = resultados[0];
        vistaActual = "historial";
        cambiarVista("cliente");

    } else if (resultados.length > 1) {
        vistaActual = "lista";
        renderListaClientes(resultados);

    } else {

        resultadoCliente.innerHTML = `
            <div class="card p-3">
                <h5>Cliente no encontrado</h5>
            </div>
        `;
    }

    buscador.value = "";
});

function obtenerClaseCategoria(categoria) {

    if (categoria === "Bespoke") return "cat-bespoke";
    if (categoria === "Diamond") return "cat-diamond";
    if (categoria === "Diamond Seg.") return "cat-diamondseg";
    if (categoria === "Platinum") return "cat-platinum";
    if (categoria === "Gold") return "cat-gold";
    if (categoria === "Classic") return "cat-classic";
    if (categoria === "No Socios") return "cat-nosocios";

    return "";
}


// RENDER//


function renderCliente(cliente) {

    const estadoActual = obtenerEstadoActual(cliente);
    const estadoTexto = formatearEstado(estadoActual);
    const estadoVisual = getEstadoVisual(cliente);

    const estaEnSala = cliente.enVip;
    const esEnSala = estadoActual.estado === "EN_SALA";

    const tieneAutoexclusion = cliente.autoexclusion?.activa;
    const tieneProhibicion = cliente.prohibicion?.activa;

    const cantidadAcompanantes = cliente.acompanantes?.length || 0;

    const esPermanenciaLarga = estaEnPermanenciaLarga(cliente);

    let html = `

<div class="clientes-wrapper">

    <article class="datos-contenedor" style="align-items:center;">

        <b style="display:block; text-align:center;">CLIENTE</b>

        <div class="card ficha-cliente ${estadoVisual} ${obtenerClaseCategoria(cliente.categoria)}">

            <!-- ========================= -->
            <!-- HEADER (BLOQUE AISLADO) -->
            <!-- ========================= -->

            <div class="card-header">

    ${esPermanenciaLarga ? `<div class="punto-alerta-12h"></div>` : ""}

    <button class="icon-btn" data-action="ver-foto-cliente" title="Ver foto">
        <i class="bi bi-camera-fill"></i>
    </button>

</div>

                <div class="cliente-header-datos">

    <div><strong>${cliente.nombre}</strong></div>

    <div>DNI: ${cliente.dni}</div>

    <div>ID: ${cliente.id}</div>

    <div>Tarjeta: ${cliente.tarjeta || "-"}</div>

    <div>Categoría: ${cliente.categoria}</div>

    ${(cliente.pesos || cliente.dolares)
        ? `<div>Ingresó con: ${[cliente.pesos ? "Pesos" : null, cliente.dolares ? "Dólares" : null].filter(Boolean).join(" y ")}</div>`
        : ""}

    <div>${estadoTexto}</div>

    ${(cliente.categoria === "Diamond" || cliente.categoria === "Bespoke")
        ? `<div>Acompañantes: ${cantidadAcompanantes}</div>`
        : ""}

    ${tieneProhibicion
        ? `<div>PROHIBICIÓN</div>`
        : ""}

    ${tieneAutoexclusion
        ? `<div>AUTOEXCLUSIÓN</div>`
        : ""}

</div>

            </div>
            <!-- ========================= -->
            <!-- FIN HEADER -->
            <!-- ========================= -->

            <div class="acciones-card">

    <button data-action="ingreso" class="icon-btn" title="Entró">IN</button>
    <button data-action="egreso" class="icon-btn" title="Salió">OUT</button>

    <button data-action="editar" class="icon-btn" title="Editar cliente">
        <i class="bi bi-pencil"></i>
    </button>

    <button data-action="historial" class="icon-btn" title="Historial">
        <i class="bi bi-clock-history"></i>
    </button>

    <button data-action="novedades" class="icon-btn" title="Novedades">
        <i class="bi bi-journal-text"></i>
    </button>

    ${usuarioActual.rol === "supervisor"
        ? `<button data-action="lavados" class="icon-btn" title="Lavados de auto">
                <i class="bi bi-droplet-fill"></i>
            </button>`
        : ""
    }

    ${usuarioActual.rol === "supervisor"
        ? `<button data-action="generar-alerta" class="icon-btn" title="Generar alerta para el próximo ingreso">
                <i class="bi bi-bell-fill"></i>
            </button>`
        : ""
    }

    ${usuarioActual.rol === "supervisor"
        ? `<button data-action="eliminar" class="icon-btn" title="Eliminar cliente">
                <i class="bi bi-trash3"></i>
            </button>`
        : ""
    }

</div>
</article>
`;

    const acompanantes = cliente.acompanantes || [];

    html += `
<article class="datos-contenedor" style="align-items:center;">

    <div class="acomp-toolbar">
        <button class="btn-agregar-acomp" data-action="agregar-acompanante" title="Agregar acompañante">
            <i class="bi bi-person-plus-fill"></i>
            Agregar acompañante
        </button>
    </div>
`;

    if (acompanantes.length === 0) {

        html += `<div class="text-muted" style="text-align:center;">Sin acompañantes</div>`;

    } else {

        html += `<div class="lista-acompanantes">`;

        acompanantes.slice(0, 2).forEach((a, index) => {

            html += `

<div class="acompanante-item ficha-acompanante">

    <button class="icon-btn"
        data-action="ver-foto-acompanante"
        data-index="${index}"
        title="Ver foto">
        <i class="bi bi-camera-fill"></i>
    </button>

    <div>
        <strong>${a.nombre}</strong>
    </div>

    <div>
        DNI: ${a.dni}
    </div>

    <div class="acciones-acompanante">

        <button
            class="btn-editar-acomp"
            data-action="editar-acompanante"
            data-index="${index}"
            title="Editar acompañante">
            <i class="bi bi-pencil"></i>
        </button>

        <button
            class="btn-eliminar-acomp"
            data-action="eliminar-acompanante"
            data-index="${index}"
            title="Eliminar acompañante">
            <i class="bi bi-trash"></i>
        </button>

    </div>

</div>`;
        });

        html += `</div>`;
    }

    html += `
    </article>

<div id="form-acompanante-dinamico"
    style="display:none; margin-top:10px; border:1px solid #daa520; padding:10px; border-radius:8px; text-align:center;">

    <input type="text" id="acomp-nombre" placeholder="Nombre y apellido" class="form-control mb-2">

    <input type="text" id="acomp-dni" placeholder="DNI" class="form-control mb-2">

    <div class="mb-2">

    <img
        id="preview-acomp"
        src="/img/logo-foto.png"
        style="
            width:80px;
            height:80px;
            border-radius:50%;
            object-fit:cover;
            cursor:pointer;
            border:2px solid #daa520;
        ">

    <input
    type="file"
    id="acomp-foto"
    accept="image/*"
    style="position:absolute; left:-9999px;">

</div>

    <button
    data-action="guardar-acompanante"
    class="btn btn-dorado">
    Guardar
    </button>

</div>

`;

    html += `
</div>


<div id="panel-extra"></div>

<div class="zona-volver">
    <button
        class="btn btn-secondary btn-volver"
        onclick="volverMetricas()">
        Volver
    </button>
</div>

`;

    resultadoCliente.innerHTML = html;
}
        


// RENDER PANEL (HISTORIAL / NOVEDADES)//

function formatearFecha(ts) {
    const d = new Date(ts);

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();

    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${hora}:${min} hs.`;
}

function refreshUI() {
    renderCliente(clienteActual);
}

function actualizarMetricas() {

    const total = clientes.length;

    const enSala = clientes.filter(c => {
        return obtenerEstadoActual(c)?.estado === "EN_SALA";
    }).length;

    const fuera = total - enSala;

    document.getElementById("metricas-total").textContent = total;
    document.getElementById("metricas-en-sala").textContent = enSala;
    document.getElementById("metricas-fuera").textContent = fuera;
}

function calcularMetricas() {

    const data = clientes; // SIEMPRE ARRAY GLOBAL

    const resultado = {};

    data.forEach(c => {
        const cat = c.categoria;

        if (!resultado[cat]) {
            resultado[cat] = 0;
        }

        resultado[cat]++;
    });

    return resultado;
}

function formatearHora(ts) {

    const d = new Date(ts);

    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${hora}:${min} hs.`;
}

function agruparHistorial(historial) {

    const dias = {};

    historial.forEach(item => {

        const fechaObj = new Date(item.fecha);
        const key = fechaObj.toLocaleDateString("es-AR");

        if (!dias[key]) {
            dias[key] = {
                fecha: key,
                visitas: [],
                acompanantes: 0
            };
        }

        if (item.tipo === "INGRESO") {
            dias[key].visitas.push({
                ingreso: item.fecha,
                egreso: null
            });
        }

        if (item.tipo === "EGRESO") {
            const visitas = dias[key].visitas;

            for (let i = visitas.length - 1; i >= 0; i--) {
                if (visitas[i].egreso === null) {
                    visitas[i].egreso = item.fecha;
                    break;
                }
            }
        }
    });

    return Object.values(dias).sort((a, b) => {
        return new Date(a.fecha.split('/').reverse().join('-')) -
            new Date(b.fecha.split('/').reverse().join('-'));
    });
}

function obtenerEstadoActual(cliente) {

    if (!cliente) {
        return {
            estado: "SIN_DATOS"
        };
    }

    const eventos = cliente.historial || [];

    // recorrer de atrás hacia adelante
    for (let i = eventos.length - 1; i >= 0; i--) {
        const ev = eventos[i];

        if (ev.tipo === "INGRESO") {

            const tieneEgresoPosterior = eventos
                .slice(i + 1)
                .some(e => e.tipo === "EGRESO");

            if (!tieneEgresoPosterior) {
                return {
                    estado: "EN_SALA",
                    hora: ev.fecha
                };
            }
        }
    }

    return {
        estado: "FUERA"
    };
}

function estaEnPermanenciaLarga(cliente) {
    const eventos = cliente.historial || [];

    const ultimoIngreso = [...eventos]
        .reverse()
        .find(e => e.tipo === "INGRESO");

    if (!ultimoIngreso) return false;

    const ahora = Date.now();
    const horas = (ahora - ultimoIngreso.fecha) / (1000 * 60 * 60);

    return horas >= 12;
}

function getEstadoVisual(cliente) {

    if (cliente.prohibicion?.activa || cliente.autoexclusion?.activa) {
        return "ROJO";
    }

    if (estaEnPermanenciaLarga(cliente)) {
        return "NARANJA";
    }

    if (cliente.enVip) {
        return "VERDE";
    }

    return "GRIS";
}

function formatearEstado(estado) {

    if (estado.estado === "EN_SALA") {

        const fecha = new Date(estado.hora);

        const hoy = new Date();

        const mismoDia =
            fecha.getDate() === hoy.getDate() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getFullYear() === hoy.getFullYear();

        if (mismoDia) {
            const hora = fecha.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            return `${hora} hs - En sala`;
        }

        const fechaHora =
    String(fecha.getDate()).padStart(2, "0") + "/" +
    String(fecha.getMonth() + 1).padStart(2, "0") + "/" +
    fecha.getFullYear() + " " +
    String(fecha.getHours()).padStart(2, "0") + ":" +
    String(fecha.getMinutes()).padStart(2, "0");

return `${fechaHora} hs - En sala`;

    }

    return "";
}


function renderPanel() {

    if (!clienteActual) return;

    const div = document.getElementById("panel-extra");

    if (!vistaActual) {
        div.innerHTML = "";
        return;
    }

    const estado = obtenerEstadoActual(clienteActual);
    const estadoTexto = formatearEstado(estado);


    /* ================= HISTORIAL ================= */


    if (vistaActual === "historial") {

        const historialFiltrado = clienteActual.historial.filter(item => {

            if (!historialDesde && !historialHasta) return true;

            const fecha = new Date(item.fecha);

            if (historialDesde && fecha < new Date(historialDesde)) return false;

            if (historialHasta) {
                const hasta = new Date(historialHasta);
                hasta.setHours(23, 59, 59, 999);
                if (fecha > hasta) return false;
            }

            return true;
        });

        const historialAgrupado = agruparHistorial(historialFiltrado)
            .map(dia => ({
                ...dia,
                visitas: dia.visitas.filter(v => v.ingreso && v.egreso)
            }))
            .filter(dia => dia.visitas.length > 0);



        const contenidoHistorial = `
            <div class="d-flex justify-content-center align-items-center gap-2 mb-3" style="flex-wrap:wrap;">

                <input type="date" id="historial-desde" value="${historialDesde}"
                    onchange="historialDesde=this.value;renderPanel();">

                <span style="color:#d4af37;">a</span>

                <input type="date" id="historial-hasta" value="${historialHasta}"
                    onchange="historialHasta=this.value;renderPanel();">

                ${(historialDesde || historialHasta) ? `
                    <button type="button" class="icon-btn"
                        onclick="historialDesde='';historialHasta='';renderPanel();"
                        title="Quitar filtro de fechas">
                        <i class="bi bi-x-lg"></i>
                    </button>
                ` : ""}

            </div>

            ${historialAgrupado.length > 0
                ? `
                        <div class="row g-2">
                            ${historialAgrupado.map(dia => `
                                <div class="col-12 col-md-3">
                                    <div class="card h-100">
                                        <div class="card-body" style="color:#d4af37; display:flex; flex-direction:column; gap:6px; text-align:center;">

                                            <div style="font-weight:bold; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:4px;">
                                                ${dia.fecha}
                                            </div>

                                            <div>
                                                ${dia.visitas
                        .filter(v => v.egreso)
                        .map(v => `
                                                        <div style="padding:2px 0;">
                                                            ${formatearHora(v.ingreso)} → ${formatearHora(v.egreso)}
                                                        </div>
                                                    `).join("")}
                                            </div>

                                            ${(clienteActual.categoria === "Diamond" || clienteActual.categoria === "Bespoke") && dia.acompanantes > 0 ? `
                                                <div style="margin-top:6px; font-size:0.9em; opacity:0.9;">
                                                    Acompañante${dia.acompanantes > 1 ? "s" : ""}: ${dia.acompanantes}
                                                </div>
                                            ` : ""}

                                        </div>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    `
                : `
                        <div class="alert alert-secondary text-center">
    No existen registros para el período seleccionado
</div>
                    `
            }
        `;

        div.innerHTML = contenidoHistorial;
    }



    /* ================= NOVEDADES ================= */

    else if (vistaActual === "novedades") {

        const novedades = (clienteActual.novedades || []).filter(n =>
            usuarioActual.rol === "supervisor" || n.autor !== "supervisor"
        );

        let html = `
            <div class="d-flex align-items-center gap-1 mb-2">
                <h5 class="m-0">Novedades</h5>

                <button class="btn btn-warning fw-bold"
                        data-action="agregar-novedad"
                        style="width:24px;height:24px;padding:0;">
                    +
                </button>
            </div>
    `;


        if (modoCrearNovedad) {

            html += `
        <div class="card mb-2"
            style="border:1.5px solid #daa520;border-radius:10px;background:#1a1a1a;overflow:hidden;">

        <textarea id="input-novedad" class="novedad-textarea" placeholder="Escribí la novedad..."
            style="background:#1a1a1a; color:#f0f0f0; border:none;"></textarea>

        <label style="display:flex; align-items:center; gap:6px; padding:6px 10px; color:#daa520; font-size:14px;">
            <input type="checkbox" id="chk-novedad-atencion">
            Requiere hablar con el cliente (avisar al supervisor)
        </label>

        <div class="p-2">

            <div class="novedad-footer">

    <div class="contador-novedad" id="contador-novedad">
        0/50 
    </div>

    <div class="novedad-actions">

        <button data-action="guardar-novedad" class="icon-btn">
    <i class="bi bi-floppy"></i>
</button>

<button data-action="cancelar-novedad" class="icon-btn">
    <i class="bi bi-x-lg"></i>
</button>

    </div>

</div>

            </div>

        </div>

    </div>
`;
        }

        if (novedades.length > 0) {

            html += novedades
                .slice()
                .sort((a, b) => b.fecha - a.fecha)
                .map(item => `
                    <div class="card mt-2">
                        <div class="card-body d-flex justify-content-start align-items-center gap-3">

                            <div style="flex:1;">
                                <small style="color:#d4af37;">
                                    ${formatearFecha(item.fecha)}
                                    ${(item.autor === "supervisor" && usuarioActual.rol === "supervisor")
                        ? ` · <span style="opacity:.7;">(solo supervisor)</span>`
                        : ""}
                                </small>

                                <p class="mb-0" style="color:#d4af37;">
                                    ${item.texto}
                                </p>
                            </div>

                            <div>

                                <div class="d-flex gap-2">

    <button data-action="ver-novedad"
            data-fecha="${item.fecha}"
            class="icon-btn">
        <i class="bi bi-eye"></i>
    </button>

    ${usuarioActual.rol === "supervisor" ? `
        <button data-action="editar-novedad"
                data-fecha="${item.fecha}"
                class="icon-btn">
            <i class="bi bi-pencil"></i>
        </button>

        <button data-action="eliminar-novedad"
                data-fecha="${item.fecha}"
                class="icon-btn">
            <i class="bi bi-trash3"></i>
        </button>` : ""}

</div>

                            </div>
                        </div>
                    </div>

                `).join("");
        } else {
            html += `<p style="color:#daa520; text-align:center;">Sin novedades registradas</p>`;
        }
        div.innerHTML = html;


        if (modoCrearNovedad) {

            const textarea = document.getElementById("input-novedad");
            const contador = document.getElementById("contador-novedad");

            textarea?.addEventListener("input", () => {

                const palabras = textarea.value
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);

                contador.textContent =
                    `${palabras.length} / 50 palabras`;
            });
        }
    }

    /* ================= LAVADOS ================= */

    else if (vistaActual === "lavados") {

        let html = `
            <div class="d-flex align-items-center gap-1 mb-2">
                <h5 class="m-0">Lavados de auto</h5>
            </div>
        `;

        if (lavadosClienteActual.length === 0) {
            html += `<p style="color:#daa520; text-align:center;">Sin lavados registrados</p>`;
        } else {
            html += `<div class="row g-2">`;

            lavadosClienteActual.forEach(l => {
                const fecha = new Date(l.fechaCreacion).toLocaleDateString("es-AR");

                const horaTexto = (etiqueta, valor) => valor
                    ? `${etiqueta}: ${new Date(valor).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
                    : `${etiqueta}: -`;

                html += `
                    <div class="col-12 col-md-4">
                        <div class="card h-100">
                            <div class="card-body" style="color:#d4af37; text-align:center;">
                                <strong>${l.modelo} — ${l.patente}</strong><br>
                                <small>${fecha} · Estado: ${l.estado}</small><br>
                                <small>Autorizó: ${l.autorizadoPorApellido || "-"}</small><br>
                                <small>${horaTexto("Autorización", l.horaAutorizacion)}</small><br>
                                <small>${horaTexto("Aceptación", l.horaAceptacion)}</small><br>
                                <small>${horaTexto("Finalización", l.horaFinalizacion)}</small><br>
                                <small>Llavero: ${l.numeroLlavero || "-"}</small>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        div.innerHTML = html;
    }

    /* ================= VER NOVEDAD ================= */


    else if (vistaActual === "ver-novedad") {


        const esSupervisor = usuarioActual.rol === "supervisor";

        const fechaNovedad = new Date(novedadSeleccionada.fecha);

        const fechaFormateada =
            fechaNovedad.toLocaleDateString("es-AR") +
            " " +
            fechaNovedad.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }) +
            " hs.";

        div.innerHTML = `
            <div class="card mt-2" style="border-radius:10px; overflow:hidden;">
                <div class="card-body p-3" style="position:relative;">

                    <button class="btn btn-sm btn-warning"
                            style="position:absolute; top:10px; right:10px;"
                            data-action="volver-novedades">
                        ✖
                    </button>

                    <small class="d-block mb-2"
                        style="color:#d4af37; font-weight:500;">
                        ${fechaFormateada}
                    </small>

                    <div class="estado-cliente">
    ${estadoTexto}
</div>

                    ${!modoEdicionNovedad ? `
    <p class="mb-0" style="color:#d4af37;">
        ${novedadSeleccionada.texto || ""}
    </p>
` : `
    <textarea id="input-novedad" class="novedad-textarea"
        style="background:#1a1a1a; color:#f0f0f0; border:1.5px solid #daa520; border-radius:8px;">${novedadSeleccionada.texto || ""}</textarea>

    <small id="contador-novedad" class="d-block text-center" style="color:#d4af37;">0 / 50 palabras</small>
`}

                    <div class="mt-3 d-flex justify-content-center gap-2">

                        ${esSupervisor && modoEdicionNovedad ? `
                            <button class="btn btn-warning btn-sm"
                                    data-action="guardar-edicion-novedad">
                                Guardar
                            </button>
                        ` : ""}

                    </div>

                </div>
            </div>
        `;
    }
}


function normalizarEvento(evento) {

    if (!evento) return null;

    // ya está en formato nuevo
    if (evento.subTipo) return evento;

    let tipo = evento.tipo;
    let subTipo = "SOCIO";

    if (tipo.includes("ACOMPAÑANTE")) {
        subTipo = "ACOMPANANTE";
        tipo = tipo.includes("EGRESO") ? "EGRESO" : "INGRESO";
    }

    if (tipo === "SALIO") {
        tipo = "EGRESO";
    }

    if (tipo === "ENTRO") {
        tipo = "INGRESO";
    }

    return {
        tipo,
        subTipo,
        fecha: evento.fecha
    };
}

//EVENTOS//

resultadoCliente.addEventListener("click", function (e) {

    const card = e.target.closest(".cliente-listado");

    if (card) {


        const id = card.dataset.id;
        clienteActual = clientes.find(c => c.id === id);
        renderCliente(clienteActual);
        return;
    }

    if (!clienteActual) return;

    const action = e.target.closest("[data-action]")?.dataset.action;

    if (!action) return;


    if (action === "editar") {


        panelNuevo.classList.remove("oculto");

        panelNuevo.innerHTML = `
    <div class="modal-edicion-overlay">
        <div class="modal-edicion">

            <h4>Editar cliente</h4>

            <div class="mb-2">
    <label>Nombre y Apellido</label>
    <input
        id="edit-nombre"
        class="form-control"
        value="${clienteActual.nombre}">
</div>

<div class="mb-2">
    <label>DNI</label>
    <input
        id="edit-dni"
        class="form-control"
        value="${clienteActual.dni}">
</div>

<div class="mb-2">
    <label>ID Cliente</label>
    <input
        id="edit-id"
        class="form-control"
        value="${clienteActual.id}"
        ${usuarioActual.rol !== "supervisor" ? "readonly" : ""}>
</div>

<div class="mb-2">
    <label>Número de Tarjeta</label>
    <input
        id="edit-tarjeta"
        class="form-control"
        value="${clienteActual.tarjeta || ""}">
</div>

<div class="mb-2">
    <label>Categoría</label>
    <select id="edit-categoria" class="form-control">
        <option value="Bespoke">Bespoke</option>
        <option value="Diamond">Diamond</option>
        <option value="Diamond Seg.">Diamond Seg.</option>
        <option value="Platinum">Platinum</option>
        <option value="Gold">Gold</option>
        <option value="Classic">Classic</option>
        </select>
</div>

<div class="mb-2 foto-edit-container">
    <label>Foto</label>

    <button
        type="button"
        class="icon-btn"
        onclick="document.getElementById('edit-foto').click()">
        <i class="bi bi-camera-fill"></i>
    </button>

    <input type="file" id="edit-foto" class="oculto">
</div>

${usuarioActual.rol === "supervisor" ? `
<div class="mb-2" style="border-top:1px solid rgba(218,165,32,0.3); padding-top:12px; margin-top:8px;">

    <label style="display:flex; align-items:center; gap:8px; justify-content:center;">
        <input type="checkbox" id="edit-prohibicion" ${clienteActual.prohibicion?.activa ? "checked" : ""}>
        Prohibición
    </label>

    <label style="display:flex; align-items:center; gap:8px; justify-content:center; margin-top:6px;">
        <input type="checkbox" id="edit-autoexclusion" ${clienteActual.autoexclusion?.activa ? "checked" : ""}>
        Autoexclusión
    </label>

    <label style="display:flex; align-items:center; gap:8px; justify-content:center; margin-top:6px;">
        <input type="checkbox" id="edit-excepcion-lavado" ${clienteActual.excepcionLavado?.activa ? "checked" : ""}>
        Excepción: beneficio de lavado de auto
    </label>

    <input
        id="edit-motivo-restriccion"
        class="form-control"
        placeholder="Motivo (opcional)"
        style="margin-top:8px;"
        value="${clienteActual.prohibicion?.motivo || clienteActual.autoexclusion?.motivo || ""}">

    <div style="text-align:center; margin-top:12px;">
        <label style="color:#999; font-size:12px;">PIN del beneficio (4 dígitos)</label>
        <input
            id="edit-pin"
            class="form-control"
            style="max-width:160px; margin:6px auto;"
            maxlength="4"
            inputmode="numeric"
            value="${clienteActual.pin || ""}">
        <button type="button" id="btn-pin-aleatorio" class="btn-accion-principal" style="padding:6px 14px !important; font-size:13px;">
            Generar uno al azar
        </button>
    </div>
</div>
` : ""}



            <div class="d-flex gap-2 justify-content-center">
                <button id="guardar-edicion" class="btn btn-warning">
                    Guardar
                </button>

                <button id="cancelar-edicion" class="btn btn-secondary">
                    Cancelar
                </button>
            </div>

        </div>
    </div>
    `;

    formIngreso.activo = true;

    }


    if (action === "ingreso") {

        if (tieneProhibicionActiva(clienteActual)) {

            const esProhibicion = clienteActual.prohibicion?.activa;
            const tipoAlerta = esProhibicion ? "PROHIBICIÓN" : "AUTOEXCLUSIÓN";

            mostrarAviso(`${tipoAlerta} ACTIVA - COMUNICARSE CON JEFE VIP`);

            registrarAlerta(
                clienteActual.id,
                esProhibicion ? "PROHIBICION" : "AUTOEXCLUSION",
                `Intento de ingreso con ${tipoAlerta.toLowerCase()} activa`
            );

            renderCampanaAlertas();

            return;
        }

        clienteActual.enVip = true;

        registrarEventoCliente(clienteActual.id, "INGRESO");

        // Alerta: novedades marcadas "requiere atención" que todavía no avisaron
        (clienteActual.novedades || []).forEach(nov => {
            if (nov.requiereAtencion && !nov.alertaEnviada) {
                registrarAlerta(clienteActual.id, "NOVEDAD", `Novedad: ${nov.texto}`);
                nov.alertaEnviada = true;
            }
        });

        // Alerta: avisos manuales cargados por el supervisor, todavía sin enviar
        (clienteActual.alertasCliente || []).forEach(av => {
            if (!av.alertaEnviada) {
                registrarAlerta(clienteActual.id, "MANUAL", av.motivo);
                av.alertaEnviada = true;
            }
        });

        // Alerta: ingreso de un cliente "No socios"
        if (clienteActual.categoria === "No socios") {
            const moneda = [
                clienteActual.pesos ? "Pesos" : null,
                clienteActual.dolares ? "Dólares" : null
            ].filter(Boolean).join(" y ") || "sin especificar";

            registrarAlerta(
                clienteActual.id,
                "NO_SOCIO",
                `Ingresó un cliente sin membresía (No socios) - Moneda: ${moneda}`
            );
        }

        renderCampanaAlertas();

        guardarClientes();
        renderCliente(clienteActual);
        renderEstadisticas();
        return;
    }

    if (action === "egreso") {

        registrarEventoCliente(clienteActual.id, "EGRESO");

        clienteActual.enVip = false;

        guardarClientes();
        renderCliente(clienteActual);
        renderEstadisticas();
        return;
    }
});

document.addEventListener("click", async function (e) {

    const boton = e.target.closest("[data-action]");
    if (!boton) return;

    const action = boton.getAttribute("data-action");


    /* =========================
    HISTORIAL / NOVEDADES
    ========================== */

    if (action === "historial") {
        vistaActual = (vistaActual === "historial") ? "" : "historial";
        renderPanel();
    }
    

    if (action === "novedades") {
        vistaActual = (vistaActual === "novedades") ? "" : "novedades";
        renderPanel();
    }

    if (action === "lavados") {
        if (vistaActual === "lavados") {
            vistaActual = "";
            renderPanel();
        } else {
            vistaActual = "lavados";
            cargarLavadosDelCliente(clienteActual.id);
        }
    }

    if (action === "agregar-novedad") {
        modoCrearNovedad = true;
        renderPanel();
    }

    if (action === "guardar-novedad") {

        const texto = document.getElementById("input-novedad")?.value.trim();
        if (!texto) return;

        const requiereAtencion = document.getElementById("chk-novedad-atencion")?.checked || false;

        clienteActual.novedades.push({
            texto,
            fecha: Date.now(),
            autor: usuarioActual.rol,
            requiereAtencion,
            alertaEnviada: false
        });

        guardarClientes();

        modoCrearNovedad = false;
        renderPanel();
    }

    if (action === "cancelar-novedad") {
        modoCrearNovedad = false;
        renderPanel();
    }

    if (action === "ver-novedad") {

        const fecha = Number(boton.getAttribute("data-fecha"));

        const index = clienteActual.novedades.findIndex(n => n.fecha === fecha);
        if (index === -1) return;

        novedadSeleccionada = clienteActual.novedades[index];
        indexNovedadSeleccionada = index;

        modoEdicionNovedad = false;
        vistaActual = "ver-novedad";

        renderPanel();
    }

    if (action === "volver-novedades") {
        vistaActual = "novedades";
        renderPanel();
    }

    if (action === "editar-novedad") {

        const fecha = Number(boton.getAttribute("data-fecha"));

        const index = clienteActual.novedades.findIndex(n => n.fecha === fecha);
        if (index === -1) return;

        novedadSeleccionada = clienteActual.novedades[index];
        indexNovedadSeleccionada = index;

        modoEdicionNovedad = true;
        vistaActual = "ver-novedad";

        setTimeout(() => {
            document.getElementById("input-novedad").value =
                novedadSeleccionada.texto || "";
        }, 0);

        renderPanel();
    }

    if (action === "guardar-edicion-novedad") {

        const texto = document.getElementById("input-novedad")?.value.trim();
        if (!texto) return;

        novedadSeleccionada.texto = texto;

        guardarClientes();
        modoEdicionNovedad = false;

        renderPanel();
    }

    if (action === "eliminar-novedad") {

        const fecha = Number(boton.getAttribute("data-fecha"));

        const index = clienteActual.novedades.findIndex(n => n.fecha === fecha);
        if (index === -1) return;

        abrirModalConfirmacion(
            "Eliminar novedad",
            "¿Desea eliminar esta novedad?",
            (confirmado) => {

                if (!confirmado) return;

                clienteActual.novedades.splice(index, 1);

                guardarClientes();
                renderPanel();
            }
        );
    }

    /* =========================
    CLIENTE
    ========================== */

    if (action === "generar-alerta") {

        if (usuarioActual.rol !== "supervisor") return;

        abrirModalAlertaManual(clienteActual);
        return;
    }

    if (action === "eliminar") {

        const confirmar = await mostrarConfirmacion("¿Seguro que querés eliminar este cliente?");
        if (!confirmar) return;

        clientes = clientes.filter(c => c.id !== clienteActual.id);

        guardarClientes();

        clienteActual = null;
        volverInicio();
    }

    if (action === "ver-foto-cliente") {

        const boton = e.target.closest("button");

        boton.innerHTML = `
            <img src="${clienteActual.foto}"
                style="width:110px;height:110px;object-fit:cover;border-radius:50%;border:3px solid #daa520;">
        `;

        setTimeout(() => {
            boton.innerHTML = `<i class="bi bi-camera-fill"></i>`;
        }, 4000);
    }

    if (action === "ver-foto") {

        const boton = e.target.closest("button");

        boton.innerHTML = `
            <img src="${clienteActual.acompanantes?.[0]?.foto || ''}"
                style="width:110px;height:110px;object-fit:cover;border-radius:50%;border:3px solid #daa520;">
        `;

        setTimeout(() => {
            boton.innerHTML = `<i class="bi bi-camera-fill"></i>`;
        }, 4000);
    }

    /* =========================
    ACOMPAÑANTE
    ========================== */

    if (action === "toggle-acompanante") {
        clienteActual.acompanante.ingresa = e.target.checked;
        guardarClientes();
    }

});



function volverInicio() {

    clienteActual = null;
    vistaActual = "inicio";

    panelNuevo.innerHTML = "";
    panelNuevo.classList.add("oculto");

    panelEstadisticas.style.display = "none";

    resultadoCliente.style.display = "block";

    resultadoCliente.innerHTML = `
        <div id="pantalla-espera">
            <img src="img/Logo-ingreso.jpeg" class="logo">
            <h1 id="reloj-digital"></h1>
            <p id="fecha-digital"></p>
        </div>
    `;

    actualizarReloj();
}


function actualizarReloj() {

    const ahora = new Date();

    const hora = ahora.toLocaleTimeString("es-AR", {
        hour12: false
    });
    const fecha = ahora.toLocaleDateString("es-AR");

    const reloj = document.getElementById("reloj-digital");
    const fechaTexto = document.getElementById("fecha-digital");

    if (reloj) reloj.textContent = hora;
    if (fechaTexto) fechaTexto.textContent = fecha;
}


function renderListaClientes(lista) {

    resultadoCliente.innerHTML = lista.map(cliente => `
        <div class="card mt-2 p-2 cliente-listado"
            data-id="${cliente.id}"
            style="cursor:pointer;">
            <strong>${cliente.nombre}</strong>
            <p>${cliente.categoria}</p>
        </div>
    `).join("");

    vistaActual = "lista";
    clienteActual = null;
}


function toggleCategoria(cat) {

    if (categoriaExpandida === cat) {
        categoriaExpandida = null;
    } else {
        categoriaExpandida = cat;
    }

    renderEstadisticas();
}


/* =========================
CLICK PRINCIPAL (ACCIONES)
========================= */

document.addEventListener("click", function (e) {

    const action = e.target.closest("[data-action]")?.dataset.action;

    /* VOLVER */
    if (e.target.id === "btn-volver-categorias") {
        categoriaExpandida = null;
        renderEstadisticas();
        renderListaClientes(clientes);
        return;
    }

    /* AGREGAR */
    if (action === "agregar-acompanante") {
        const form = document.getElementById("form-acompanante-dinamico");
        if (form) form.style.display = "block";
    }

    /* EDITAR */
    if (action === "editar-acompanante") {

        const boton = e.target.closest("[data-index]");
        if (!boton) return;

        const index = parseInt(boton.dataset.index);

        const clienteIndex = clientes.findIndex(c => c.id == clienteActual.id);

        if (clienteIndex === -1) return;

        const acomp = clientes[clienteIndex].acompanantes[index];
        if (!acomp) return;

        acompananteEditIndex = index;

        document.getElementById("acomp-nombre").value = acomp.nombre;
        document.getElementById("acomp-dni").value = acomp.dni;

        const form = document.getElementById("form-acompanante-dinamico");
        if (form) form.style.display = "block";

        clienteActual = clientes[clienteIndex];
    }

    if (action === "ver-foto-acompanante") {

        const index = parseInt(
            e.target.closest("[data-index]")?.dataset.index
        );

        if (isNaN(index)) return;

        const acomp = clienteActual.acompanantes[index];

        if (!acomp?.foto) return;

        const boton = e.target.closest("button");

        boton.innerHTML = `
        <img
            src="${acomp.foto}"
            style="
                width:110px;
                height:110px;
                object-fit:cover;
                border-radius:50%;
                border:3px solid #daa520;
            ">
    `;

        boton.style.background = "transparent";
        boton.style.border = "none";
        boton.style.width = "120px";
        boton.style.height = "120px";

        setTimeout(() => {

            boton.innerHTML =
                `<i class="bi bi-camera-fill"></i>`;

            boton.style.width = "";
            boton.style.height = "";
            boton.style.background = "";
            boton.style.border = "";

        }, 4000);
    }

    /* ELIMINAR */
    if (action === "eliminar-acompanante") {

        const index = parseInt(
            e.target.closest("[data-index]")?.dataset.index
        );

        if (isNaN(index)) return;

        abrirModalConfirmacion(
            "Eliminar acompañante",
            "¿Desea eliminar este acompañante?",
            (confirmado) => {

                if (!confirmado) return;

                clienteActual.acompanantes.splice(index, 1);

                guardarClientes();
                renderCliente(clienteActual);
            }
        );

        return;
    }

    /* GUARDAR */
    
    if (action === "guardar-acompanante") {

        const nombre = document.getElementById("acomp-nombre").value.trim();
        const dni = document.getElementById("acomp-dni").value.trim();
        const fileInput = document.getElementById("acomp-foto");

        if (!nombre || !dni) return;

        const file = fileInput.files[0];

        const procesarGuardado = (fotoBase64 = "") => {

            if (!clienteActual.acompanantes) {
                clienteActual.acompanantes = [];
            }

            if (acompananteEditIndex !== null) {

                clienteActual.acompanantes[acompananteEditIndex].nombre = nombre;
                clienteActual.acompanantes[acompananteEditIndex].dni = dni;

                if (fotoBase64) {
                    clienteActual.acompanantes[acompananteEditIndex].foto = fotoBase64;
                }

                acompananteEditIndex = null;

            } else {

                if (clienteActual.acompanantes.length >= 2) return;

                clienteActual.acompanantes.push({
                    nombre,
                    dni,
                    foto: fotoBase64
                });
            }

            guardarClientes();
            renderCliente(clienteActual);

            document.getElementById("acomp-nombre").value = "";
            document.getElementById("acomp-dni").value = "";
            document.getElementById("acomp-foto").value = "";

            document.getElementById("form-acompanante-dinamico").style.display = "none";
        };

        if (file) {

            const reader = new FileReader();

            reader.onload = function (e) {
                procesarGuardado(e.target.result);
            };

            reader.readAsDataURL(file);

        } else {

            procesarGuardado("");
        }
    }

});


/* =========================
CLICK FUERA (CERRAR FORM)
========================= */

document.addEventListener("click", function (e) {

    const form = document.getElementById("form-acompanante-dinamico");
    if (!form) return;

    const isInside = form.contains(e.target);
    const isActionButton =
        e.target.closest("[data-action='agregar-acompanante']") ||
        e.target.closest("[data-action='editar-acompanante']");

    if (!isInside && !isActionButton) {
        form.style.display = "none";
        acompananteEditIndex = null;
    }
});


/* =========================
INPUT CLEAN
========================= */

document.addEventListener("input", function (e) {

    if (e.target.id === "acomp-nombre") {
        e.target.style.border = "";
    }

    if (e.target.id === "acomp-dni") {
        e.target.style.border = "";
    }

// =====================
    // FORM INGRESO NUEVO
    // =====================


    if (!formIngreso.activo) return;

    switch (e.target.id) {

        case "nuevo-nombre":
            formIngreso.nombre = e.target.value;
            break;

        case "nuevo-dni":
            formIngreso.dni = e.target.value;
            break;

        case "nuevo-email":
            formIngreso.email = e.target.value;
            break;

        case "nuevo-celular":
            formIngreso.celular = e.target.value;
            break;

        case "nuevo-categoria":
            formIngreso.categoria = e.target.value;
            break;

        case "nuevo-tarjeta":
            formIngreso.tarjeta = e.target.value;
            break;
    }
});




// =====================
// SUPERVISOR LOGIN 
// =====================

document.addEventListener("DOMContentLoaded", function () {

    const btnSupervisor = document.getElementById("btn-supervisor");

    if (!btnSupervisor) return;

    btnSupervisor.addEventListener("click", function () {
        document.getElementById("login-supervisor").classList.remove("oculto");
    });

    const btnOk = document.getElementById("btn-login-ok");
    const btnCancel = document.getElementById("btn-login-cancel");

    if (btnOk) {
        btnOk.addEventListener("click", function () {

            const pass = document.getElementById("input-pass").value;

            if (pass === supervisor.pass) {
                usuarioActual = supervisor;
                actualizarVistaUsuario();

                refreshUI();

                document.getElementById("login-supervisor").classList.add("oculto");
            } else {
                mostrarAviso("Contraseña incorrecta");
            }
        });
    }

    if (btnCancel) {
        btnCancel.addEventListener("click", function () {
            document.getElementById("login-supervisor").classList.add("oculto");
        });
    }
});


// =====================
// ABRIR CLIENTE 
// =====================

function abrirCliente(id) {

    const cliente = clientes.find(c => c.id === id);

    if (!cliente) return;

    clienteActual = cliente;
    vistaActual = "cliente";

    // render primero (estado seguro)
    renderCliente(clienteActual);

    // luego cambio de vista
    document.getElementById("panel-estadisticas").style.display = "none";
    resultadoCliente.style.display = "block";
}



function volverMetricas() {

    resultadoCliente.style.display = "none";
    panelEstadisticas.style.display = "block";

    renderEstadisticas();
}

//DESLOGUEO//

btnLogout.addEventListener("click", function () {

    usuarioActual = operador;

    clienteActual = null;
    vistaActual = "inicio";

    panelNuevo.innerHTML = "";
    panelNuevo.classList.add("oculto");

    panelEstadisticas.style.display = "none";

    resultadoCliente.style.display = "block";

    volverInicio();

    actualizarVistaUsuario();
});

actualizarVistaUsuario();
setInterval(actualizarReloj, 1000);

document
    .getElementById("btn-modal-cancelar")
    .addEventListener("click", () => {

        document
            .getElementById("modal-confirmacion")
            .classList.add("oculto");

        accionPendiente = null;
    });

document
    .getElementById("btn-modal-confirmar")
    .addEventListener("click", () => {

        if (accionPendiente) {
            accionPendiente();
        }

        document
            .getElementById("modal-confirmacion")
            .classList.add("oculto");

        accionPendiente = null;
    });

resultadoCliente.innerHTML = `
    <div id="pantalla-espera">
        <img src="img/Logo-ingreso.jpeg" class="logo">
        <h1 id="reloj-digital"></h1>
        <p id="fecha-digital"></p>
    </div>
`;

//RELOJ//

actualizarReloj();

btnNuevo.addEventListener("click", function () {

    resultadoCliente.innerHTML = "";
    clienteActual = null;

    formIngreso = {
        activo: true,
        nombre: "",
        dni: "",
        email: "",
        celular: "",
        categoria: "",
        tarjeta: "",
        foto: "",
        pesos: false,
        dolares: false
    };

    panelNuevo.classList.remove("oculto");

    panelNuevo.innerHTML = `
        <div class="modal-edicion-overlay">
            <div class="modal-edicion">

                <h4>Nuevo ingreso</h4>

                <div class="mb-2">
                    <label>Nombre y Apellido</label>
                    <input
                        id="nuevo-nombre"
                        class="form-control"
                        autocomplete="off">
                </div>

                <div class="mb-2">
                    <label>DNI</label>
                    <input
                        id="nuevo-dni"
                        class="form-control"
                        autocomplete="off">
                </div>

                <div class="mb-2">
                    <label>Email</label>
                    <input
                        id="nuevo-email"
                        class="form-control"
                        autocomplete="off">
                </div>

                <div class="mb-2">
                    <label>Celular</label>
                    <input
                        id="nuevo-celular"
                        class="form-control"
                        autocomplete="off">
                </div>

                <div class="mb-2">
                    <label>Categoría</label>
                    <select id="nuevo-categoria" class="form-control">
                        <option value="">Seleccione...</option>
                        <option value="No Socios">No Socios</option>
                        <option value="Classic">Classic</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Diamond">Diamond</option>
                        <option value="Diamond Seg.">Diamond Seg.</option>
                        <option value="Bespoke">Bespoke</option>
                    </select>
                </div>

                <div class="mb-2">
                    <label>Número de Tarjeta</label>
                    <input
                        id="nuevo-tarjeta"
                        class="form-control"
                        autocomplete="off">
                </div>

                <div class="mb-2 foto-edit-container">
                    <label>Foto</label>

                    <button
                        type="button"
                        class="icon-btn"
                        onclick="document.getElementById('nuevo-foto').click()">
                        <i class="bi bi-camera-fill"></i>
                    </button>

                    <input
                        type="file"
                        id="nuevo-foto"
                        class="oculto"
                        accept="image/*">
                </div>

                <style>
                    .moneda-grupo {
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                    }
                    .chip-moneda {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 18px;
                        border: 1.5px solid #daa520;
                        border-radius: 999px;
                        background: transparent;
                        color: #daa520;
                        cursor: pointer;
                        user-select: none;
                        transition: background 0.2s, color 0.2s;
                    }
                    .chip-moneda:hover {
                        background: rgba(218, 165, 32, 0.12);
                    }
                    .chip-moneda input {
                        accent-color: #daa520;
                        width: 16px;
                        height: 16px;
                        cursor: pointer;
                    }
                    .chip-moneda:has(input:checked) {
                        background: #daa520;
                        color: #1a1a1a;
                        font-weight: 600;
                    }
                </style>

                <div class="mb-3 moneda-grupo">
                    <label class="chip-moneda">
                        <input type="checkbox" id="chk-pesos">
                        Pesos
                    </label>

                    <label class="chip-moneda">
                        <input type="checkbox" id="chk-dolares">
                        Dólares
                    </label>
                </div>

                <div class="mb-3" style="text-align:center;">
                    <input
                        id="nuevo-pin"
                        class="form-control"
                        style="max-width:200px; margin:0 auto; text-align:center;"
                        maxlength="4"
                        inputmode="numeric"
                        placeholder="PIN del beneficio (4 dígitos)">
                    <div style="color:#999; font-size:12px; margin-top:4px;">
                        Si es Bespoke o Diamond y lo dejás vacío, se genera uno al azar.
                        Otras categorías quedan sin PIN salvo que lo cargues vos.
                    </div>
                </div>

                <div class="d-flex gap-2 justify-content-center">
                    <button id="guardar-nuevo" class="btn btn-success">
                        Guardar
                    </button>
                    

                    <button id="cancelar-nuevo" class="btn btn-secondary">
                        Cancelar
                    </button>
                </div>

            </div>
        </div>
    `;
});

// =====================
// EDITAR / NUEVO CLIENTE (delegación de eventos)
// =====================

document.addEventListener("click", function (e) {

    // --- EDITAR CLIENTE ---

    if (e.target.id === "btn-pin-aleatorio") {
        const input = document.getElementById("edit-pin");
        if (input) input.value = generarPin(4);
        return;
    }

    if (e.target.id === "cancelar-edicion") {
        formIngreso.activo = false;
        panelNuevo.innerHTML = "";
        panelNuevo.classList.add("oculto");
        return;
    }

    if (e.target.id === "guardar-edicion") {
        formIngreso.activo = false;

        if (!clienteActual) return;

        const nombre = document.getElementById("edit-nombre").value.trim();
        const dni = document.getElementById("edit-dni").value.trim();
        const tarjeta = document.getElementById("edit-tarjeta").value.trim();

        if (!nombre || !dni) {
            mostrarAviso("Nombre y DNI son obligatorios");
            return;
        }

        clienteActual.nombre = nombre;
        clienteActual.dni = dni;
        clienteActual.tarjeta = tarjeta;

        const pinEditado = document.getElementById("edit-pin")?.value.trim();
        if (pinEditado) clienteActual.pin = pinEditado;

        if (usuarioActual.rol === "supervisor") {

            const yaTeniaProhibicion = !!clienteActual.prohibicion?.activa;
            const yaTeniaAutoexclusion = !!clienteActual.autoexclusion?.activa;

            const prohibicionMarcada = document.getElementById("edit-prohibicion")?.checked || false;
            const autoexclusionMarcada = document.getElementById("edit-autoexclusion")?.checked || false;
            const motivo = document.getElementById("edit-motivo-restriccion")?.value.trim() || "";

            clienteActual.prohibicion = {
                activa: prohibicionMarcada,
                motivo,
                fecha: prohibicionMarcada ? Date.now() : (clienteActual.prohibicion?.fecha || null)
            };

            clienteActual.autoexclusion = {
                activa: autoexclusionMarcada,
                motivo,
                fecha: autoexclusionMarcada ? Date.now() : (clienteActual.autoexclusion?.fecha || null)
            };

            // Si recién ahora se activa (no estaba activa antes), avisamos.
            if (prohibicionMarcada && !yaTeniaProhibicion) {
                mostrarAviso(`ALERTA SUPERVISOR: se activó PROHIBICIÓN para ${nombre}.`);
                registrarEventoCliente(clienteActual.id, "ALERTA_PROHIBICION", { motivo });
            }

            if (autoexclusionMarcada && !yaTeniaAutoexclusion) {
                mostrarAviso(`ALERTA SUPERVISOR: se activó AUTOEXCLUSIÓN para ${nombre}.`);
                registrarEventoCliente(clienteActual.id, "ALERTA_AUTOEXCLUSION", { motivo });
            }

            const excepcionLavadoMarcada = document.getElementById("edit-excepcion-lavado")?.checked || false;

            clienteActual.excepcionLavado = {
                activa: excepcionLavadoMarcada,
                motivo,
                autorizadoPor: usuarioActual.rol,
                fecha: excepcionLavadoMarcada ? Date.now() : (clienteActual.excepcionLavado?.fecha || null)
            };
        }

        const file = document.getElementById("edit-foto")?.files?.[0];

        const continuar = () => {
            clienteActual.categoria =
                document.getElementById("edit-categoria")?.value || clienteActual.categoria;

            const index = clientes.findIndex(c => c.id === clienteActual.id);

            if (index !== -1) {
                clientes[index] = { ...clienteActual };
            }

            guardarClientes();

            panelNuevo.innerHTML = "";
            panelNuevo.classList.add("oculto");

            renderCliente(clienteActual);
        };

        if (file) {
            const reader = new FileReader();

            reader.onload = function (ev) {
                clienteActual.foto = ev.target.result;
                continuar();
            };

            reader.readAsDataURL(file);

        } else {
            continuar();
        }

        return;
    }

    // --- NUEVO CLIENTE ---

    if (e.target.id === "cancelar-nuevo") {
        formIngreso.activo = false;
        panelNuevo.innerHTML = "";
        panelNuevo.classList.add("oculto");
        return;
    }

    if (e.target.id === "guardar-nuevo") {

        const nombre = document.getElementById("nuevo-nombre").value.trim();
        const dni = document.getElementById("nuevo-dni").value.trim();
        const email = document.getElementById("nuevo-email").value.trim();
        const celular = document.getElementById("nuevo-celular").value.trim();
        const categoria = document.getElementById("nuevo-categoria").value;
        const tarjeta = document.getElementById("nuevo-tarjeta").value.trim();

        if (!nombre || !dni) {
            mostrarAviso("Nombre y DNI son obligatorios");
            return;
        }

        const pesos = document.getElementById("chk-pesos").checked;
        const dolares = document.getElementById("chk-dolares").checked;

        const nuevoCliente = {
            id: Date.now().toString(),
            nombre,
            dni,
            email,
            celular,
            categoria,
            tarjeta,
            foto: "",
            acompanantes: [],
            enVip: false,
            historial: [],
            novedades: [],
            pesos,
            dolares,
            pin: (() => {
                const pinManual = document.getElementById("nuevo-pin")?.value.trim();
                if (pinManual) return pinManual;

                const categoriasConBeneficioAutomatico = ["Bespoke", "Diamond"];
                return categoriasConBeneficioAutomatico.includes(categoria) ? generarPin(4) : "";
            })()
        };

        const file = document.getElementById("nuevo-foto")?.files?.[0];

        const finalizar = () => {
            clientes.push(nuevoCliente);
            guardarClientes();

            formIngreso.activo = false;
            panelNuevo.innerHTML = "";
            panelNuevo.classList.add("oculto");

            clienteActual = nuevoCliente;
            renderCliente(clienteActual);
        };

        if (file) {
            const reader = new FileReader();

            reader.onload = function (ev) {
                nuevoCliente.foto = ev.target.result;
                finalizar();
            };

            reader.readAsDataURL(file);

        } else {
            finalizar();
        }
    }
});

function cambiarVista(vista) {

    vistaActual = vista;

    // ocultar todo
    resultadoCliente.style.display = "none";
    panelEstadisticas.style.display = "none";

    const controlesHistorico = document.getElementById("controles-historico");

    // Los calendarios de fecha solo tienen sentido junto a las métricas,
    // así que se muestran únicamente en esa vista (y solo para supervisor).
    if (controlesHistorico) {
        controlesHistorico.style.display =
            (vista === "metricas" && usuarioActual.rol === "supervisor") ? "flex" : "none";
    }

    if (vista === "lista") {
        resultadoCliente.style.display = "block";
        renderListaClientes(clientes);
    }

    if (vista === "metricas") {
        panelEstadisticas.style.display = "block";
        renderEstadisticas();
    }

    if (vista === "cliente" && clienteActual) {
        resultadoCliente.style.display = "block";
        renderCliente(clienteActual);
    }
}

// =====================
// EVENT SYSTEM CORE
// =====================

function crearEvento(tipo, datos = {}) {

    return {
        tipo,                      // INGRESO | EGRESO | EDICION | TARJETA | NOVEDAD
        fecha: Date.now(),
        operador: usuarioActual?.rol || "operador",
        ...datos
    };
}

let lavadosClienteActual = [];

async function abrirLavadosDelDia() {

    let lavados = [];

    try {
        const respuesta = await fetch("/api/lavados");
        lavados = await respuesta.json();
    } catch (error) {
        mostrarAviso("No se pudo cargar el listado de lavados");
        return;
    }

    const hoy = new Date();
    const esHoy = fecha => {
        const f = new Date(fecha);
        return f.getFullYear() === hoy.getFullYear()
            && f.getMonth() === hoy.getMonth()
            && f.getDate() === hoy.getDate();
    };

    const lavadosHoy = (Array.isArray(lavados) ? lavados : [])
        .filter(l => esHoy(l.fechaCreacion))
        .sort((a, b) => a.fechaCreacion - b.fechaCreacion);

    const hora = valor => valor
        ? new Date(valor).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
        : "-";

    const filas = lavadosHoy.map(l => `
        <tr>
            <td>${l.clienteNombre}</td>
            <td>${l.modelo}</td>
            <td>${l.patente}</td>
            <td>${l.autorizadoPorApellido || "-"}</td>
            <td>${hora(l.horaAutorizacion)}</td>
            <td>${hora(l.horaAceptacion)}</td>
            <td>${hora(l.horaFinalizacion)}</td>
            <td>${l.numeroLlavero || "-"}</td>
        </tr>
    `).join("");

    const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Lavados del día - ${hoy.toLocaleDateString("es-AR")}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
                h1 { text-align: center; font-size: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                th, td { border: 1px solid #999; padding: 6px 8px; font-size: 13px; text-align: center; }
                th { background: #eee; }
            </style>
        </head>
        <body>
            <h1>Lavados del día — ${hoy.toLocaleDateString("es-AR")}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Modelo</th>
                        <th>Patente</th>
                        <th>Autorizó</th>
                        <th>Hora autorización</th>
                        <th>Hora aceptación</th>
                        <th>Hora finalización</th>
                        <th>Llavero</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas || `<tr><td colspan="8">Sin lavados registrados hoy</td></tr>`}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const ventana = window.open("", "_blank");
    ventana.document.write(html);
    ventana.document.close();
    ventana.focus();
    ventana.print();
}

async function cargarLavadosDelCliente(clienteId) {
    try {
        const respuesta = await fetch("/api/lavados");
        const todos = await respuesta.json();

        lavadosClienteActual = (Array.isArray(todos) ? todos : [])
            .filter(l => l.clienteId === clienteId)
            .sort((a, b) => b.fechaCreacion - a.fechaCreacion);

    } catch (error) {
        console.error("No se pudieron cargar los lavados:", error);
        lavadosClienteActual = [];
    }

    renderPanel();
}

function generarPin(cantidadDigitos) {
    const min = Math.pow(10, cantidadDigitos - 1);
    const max = Math.pow(10, cantidadDigitos) - 1;
    return String(Math.floor(min + Math.random() * (max - min + 1)));
}

function registrarEventoCliente(clienteId, tipo, datos = {}) {

    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    const evento = crearEvento(tipo, datos);

    if (!cliente.historial) {
        cliente.historial = [];
    }

    cliente.historial.push(evento);

    guardarClientes();

    return evento;
}

// =====================
// ALERTAS AL SUPERVISOR
// =====================

const NOMBRES_ALERTA = {
    ALERTA_PROHIBICION: "Prohibición activa",
    ALERTA_AUTOEXCLUSION: "Autoexclusión activa",
    ALERTA_NOVEDAD: "Novedad pendiente",
    ALERTA_NO_SOCIO: "Ingreso de no socio",
    ALERTA_MANUAL: "Alerta del supervisor"
};

function mostrarAviso(mensaje) {

    document.getElementById("modal-aviso")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal-aviso";
    overlay.className = "login-overlay";

    overlay.innerHTML = `
        <div class="login-card" style="width:340px; text-align:center;">
            <p style="color:#f0f0f0; font-size:15px; white-space:pre-line; margin-bottom:1.2rem;">
                ${mensaje}
            </p>
            <button id="btn-aviso-ok" class="btn-accion-principal">Aceptar</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const cerrar = () => overlay.remove();

    document.getElementById("btn-aviso-ok").addEventListener("click", cerrar);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrar(); });
}

function mostrarConfirmacion(mensaje) {

    return new Promise(resolve => {

        document.getElementById("modal-confirm")?.remove();

        const overlay = document.createElement("div");
        overlay.id = "modal-confirm";
        overlay.className = "login-overlay";

        overlay.innerHTML = `
            <div class="login-card" style="width:340px; text-align:center;">
                <p style="color:#f0f0f0; font-size:15px; white-space:pre-line; margin-bottom:1.2rem;">
                    ${mensaje}
                </p>
                <div class="d-flex justify-content-center gap-2">
                    <button id="btn-confirm-si" class="btn-accion-principal">Sí</button>
                    <button id="btn-confirm-no" class="btn-accion-principal">No</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const responder = valor => {
            overlay.remove();
            resolve(valor);
        };

        document.getElementById("btn-confirm-si").addEventListener("click", () => responder(true));
        document.getElementById("btn-confirm-no").addEventListener("click", () => responder(false));
        overlay.addEventListener("click", e => { if (e.target === overlay) responder(false); });
    });
}

function abrirModalAlertaManual(cliente) {

    document.getElementById("modal-alerta-manual")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal-alerta-manual";
    overlay.className = "login-overlay";

    overlay.innerHTML = `
        <div class="login-card" style="width:360px; text-align:left;">
            <h4 style="text-align:center; color:#daa520; margin-bottom:1rem;">
                Generar alerta
            </h4>

            <p style="color:#d4af37; font-size:14px;">
                Se va a avisar al supervisor la próxima vez que
                <strong>${cliente.nombre}</strong> vuelva a ingresar.
            </p>

            <textarea id="input-alerta-manual"
                class="form-control"
                placeholder="Motivo de la alerta..."
                style="background:#1a1a1a; color:#f0f0f0; border:1.5px solid #daa520; min-height:90px; width:100%; text-align:left; padding:10px;">
            </textarea>

            <div class="d-flex justify-content-center gap-2 mt-3">
                <button id="btn-guardar-alerta-manual" class="btn-accion-principal">
                    Guardar
                </button>
                <button id="btn-cancelar-alerta-manual" class="btn-accion-principal">
                    Cancelar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("input-alerta-manual").focus();

    document.getElementById("btn-cancelar-alerta-manual").addEventListener("click", () => overlay.remove());

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });

    document.getElementById("btn-guardar-alerta-manual").addEventListener("click", () => {

        const motivo = document.getElementById("input-alerta-manual").value.trim();
        if (!motivo) return;

        if (!cliente.alertasCliente) cliente.alertasCliente = [];

        cliente.alertasCliente.push({
            motivo,
            fecha: Date.now(),
            alertaEnviada: false
        });

        guardarClientes();
        overlay.remove();
        renderCliente(cliente);
    });
}

function registrarAlerta(clienteId, tipoCorto, motivo) {

    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    if (!cliente.historial) cliente.historial = [];

    cliente.historial.push({
        tipo: `ALERTA_${tipoCorto}`,
        fecha: Date.now(),
        operador: usuarioActual?.rol || "operador",
        motivo,
        revisada: false
    });

    guardarClientes();
}

async function getAlertasPendientes() {

    const alertas = [];

    clientes.forEach(cliente => {
        (cliente.historial || []).forEach((evento, index) => {

            if (!evento.tipo || !evento.tipo.startsWith("ALERTA_")) return;
            if (evento.revisada) return;

            alertas.push({
                origen: "cliente",
                clienteId: cliente.id,
                clienteNombre: cliente.nombre,
                indice: index,
                tipo: evento.tipo,
                nombreTipo: NOMBRES_ALERTA[evento.tipo] || evento.tipo,
                motivo: evento.motivo || "",
                fecha: evento.fecha
            });
        });
    });

    try {
        const respuesta = await fetch("/api/lavados");
        const lavados = await respuesta.json();

        (Array.isArray(lavados) ? lavados : [])
            .filter(l => l.estado === "pendiente")
            .forEach(l => {
                alertas.push({
                    origen: "lavado",
                    pedidoId: l.id,
                    clienteNombre: l.clienteNombre,
                    tipo: "LAVADO_PENDIENTE",
                    nombreTipo: "Lavado pendiente de autorizar",
                    motivo: `${l.modelo} — ${l.patente}`,
                    fecha: l.fechaCreacion
                });
            });

    } catch (error) {
        console.error("No se pudieron cargar los lavados pendientes:", error);
    }

    return alertas.sort((a, b) => b.fecha - a.fecha);
}

function marcarAlertaRevisada(clienteId, indice) {

    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente || !cliente.historial || !cliente.historial[indice]) return;

    cliente.historial[indice].revisada = true;

    guardarClientes();
    renderCampanaAlertas();
}

async function abrirModalAutorizarLavado(pedidoId) {

    document.getElementById("modal-autorizar-lavado")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal-autorizar-lavado";
    overlay.className = "login-overlay";

    overlay.innerHTML = `
        <div class="login-card" style="width:320px;">
            <h4 style="color:#daa520; margin-bottom:1rem;">Autorizar lavado</h4>
            <input id="autorizar-legajo-modal" class="form-control mb-2" placeholder="Legajo" inputmode="numeric">
            <input id="autorizar-pin-modal" class="form-control mb-2" placeholder="PIN" type="password" inputmode="numeric" maxlength="4">
            <div id="autorizar-lavado-error" style="color:#ff6b6b; font-size:13px; min-height:18px; margin-bottom:8px;"></div>
            <div class="d-flex justify-content-center gap-2">
                <button id="btn-confirmar-autorizar-lavado" class="btn-accion-principal">Autorizar</button>
                <button id="btn-cancelar-autorizar-lavado" class="btn-accion-principal">Cancelar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("btn-cancelar-autorizar-lavado").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

    document.getElementById("btn-confirmar-autorizar-lavado").addEventListener("click", async () => {

        const legajo = document.getElementById("autorizar-legajo-modal").value.trim();
        const pin = document.getElementById("autorizar-pin-modal").value.trim();
        const errorEl = document.getElementById("autorizar-lavado-error");

        if (!legajo || !pin) {
            errorEl.textContent = "Completá legajo y PIN";
            return;
        }

        try {
            const personal = await (await fetch("/api/personal?tipo=empresa")).json();
            const persona = personal.find(p => String(p.legajo) === legajo && String(p.pin) === pin);

            if (!persona) {
                errorEl.textContent = "Legajo o PIN incorrecto";
                return;
            }

            const lavados = await (await fetch("/api/lavados")).json();
            const pedido = lavados.find(l => l.id === pedidoId);

            if (!pedido) {
                errorEl.textContent = "El pedido ya no existe (¿alguien más lo autorizó?)";
                return;
            }

            pedido.estado = "autorizado";
            pedido.autorizadoPorLegajo = persona.legajo;
            pedido.autorizadoPorApellido = persona.apellido;
            pedido.horaAutorizacion = Date.now();

            await fetch("/api/lavados", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lavados)
            });

            overlay.remove();
            renderCampanaAlertas();

        } catch (error) {
            errorEl.textContent = "No se pudo autorizar, probá de nuevo";
            console.error(error);
        }
    });
}

async function renderCampanaAlertas() {

    const contenedor = document.getElementById("campana-alertas-contenedor");
    if (!contenedor) return;

    if (usuarioActual.rol !== "supervisor" && usuarioActual.rol !== "operador") {
        contenedor.innerHTML = "";
        return;
    }

    let alertas = await getAlertasPendientes();

    // El operador solo ve los pedidos de lavado por autorizar — el resto
    // de las alertas (prohibición, novedades, etc.) son solo para supervisor.
    if (usuarioActual.rol === "operador") {
        alertas = alertas.filter(a => a.origen === "lavado");
    }

    contenedor.innerHTML = `
        <div style="position:relative; display:inline-block;">
            <button id="btn-campana-alertas" class="icon-btn" title="Alertas">
                <i class="bi bi-bell-fill"></i>
            </button>
            ${alertas.length > 0 ? `
                <span style="
                    position:absolute; top:-6px; right:-6px;
                    background:#d33; color:white; border-radius:50%;
                    font-size:11px; min-width:18px; height:18px;
                    display:flex; align-items:center; justify-content:center;
                    padding:0 4px; font-weight:bold;">
                    ${alertas.length}
                </span>
            ` : ""}
        </div>
    `;

    document.getElementById("btn-campana-alertas").addEventListener("click", function (e) {
        e.stopPropagation();
        toggleListaAlertas(alertas);
    });
}

function toggleListaAlertas(alertas) {

    let lista = document.getElementById("lista-alertas-flotante");

    if (lista) {
        lista.remove();
        return;
    }

    lista = document.createElement("div");
    lista.id = "lista-alertas-flotante";
    lista.style.cssText = `
        position:absolute; top:60px; right:20px; z-index:3000;
        background:#111; border:2px solid #daa520; border-radius:12px;
        width:320px; max-width:90vw; max-height:60vh; overflow-y:auto;
        padding:10px; box-shadow:0 0 25px rgba(0,0,0,0.5);
    `;

    lista.innerHTML = alertas.length === 0
        ? `<div style="color:#d4af37; text-align:center; padding:10px;">Sin alertas pendientes</div>`
        : alertas.map(a => {

            const accion = a.origen === "lavado"
                ? `<button
                        class="btn-accion-principal"
                        style="margin-top:6px; padding:4px 10px !important; font-size:12px;"
                        onclick="abrirModalAutorizarLavado('${a.pedidoId}'); this.closest('#lista-alertas-flotante').remove();">
                        Autorizar
                    </button>`
                : `<button
                        class="btn-accion-principal"
                        style="margin-top:6px; padding:4px 10px !important; font-size:12px;"
                        onclick="marcarAlertaRevisada('${a.clienteId}', ${a.indice}); this.closest('#lista-alertas-flotante').remove();">
                        Marcar como revisada
                    </button>`;

            return `
            <div style="border-bottom:1px solid rgba(218,165,32,0.25); padding:8px 4px;">
                <strong style="color:#daa520;">${a.nombreTipo}</strong><br>
                <span style="color:#f0f0f0; ${a.clienteId ? "cursor:pointer;" : ""}"
                    ${a.clienteId ? `onclick="abrirCliente('${a.clienteId}')"` : ""}>
                    ${a.clienteNombre}
                </span><br>
                <small style="color:#999;">${a.motivo}</small><br>
                <small style="color:#666;">${new Date(a.fecha).toLocaleString("es-AR")}</small><br>
                ${accion}
            </div>
        `;
        }).join("");

    document.body.appendChild(lista);

    setTimeout(() => {
        document.addEventListener("click", function cerrar(e) {
            if (!lista.contains(e.target)) {
                lista.remove();
                document.removeEventListener("click", cerrar);
            }
        });
    }, 0);
}

function tieneProhibicionActiva(cliente) {
    return !!(cliente?.prohibicion?.activa || cliente?.autoexclusion?.activa);
}


/*ICONO DE IMAGEN DEL ACOMPAÑANTE*/

document.addEventListener("click", (e) => {

    const preview = e.target.closest("#preview-acomp");

    if (!preview) return;

    const input = document.getElementById("acomp-foto");

    if (!input) return;

    input.click();
});