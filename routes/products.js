const express = require('express')

const router = express.Router()

const bodyParser = require('body-parser');



router.use(express.urlencoded({extended:true}))
router.use(bodyParser.json())



// CARGA PAGINA GUARDAR
router.get('/productos/nuevo',(req,res) => {
    res.render("./layouts/index.hbs",{ mensaje:""})
    res.status(200)
})


// CREAR PRODUCTO

router.post('/productos/nuevo',(req,res) => { 
        res.status(200)
        res.render("./layouts/index.hbs")      
    }
        
)


module.exports = router