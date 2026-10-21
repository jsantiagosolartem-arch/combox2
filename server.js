const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configuración de Supabase con la llave pública (Publishable Key)
const supabaseUrl = 'https://ofyyhhxuwokuakpirwfo.supabase.co';
const supabaseKey = 'sb_publishable_f1Af155Md65NWGMhO9zAMA___RKQF..';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Endpoint para REGISTRO (Exclusivo con Supabase)
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ first_name: firstName, last_name: lastName, email: email, password: password }]);

        if (error) {
            console.error('Error en Supabase:', error.message);
            return res.status(500).json({ success: false, error: error.message });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Usuario registrado exitosamente'
        });

    } catch (err) {
        console.error('Error en el registro:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint para LOGIN (Exclusivo con Supabase)
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password);

        if (error) {
            console.error('Error al consultar Supabase:', error.message);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (users && users.length > 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'Login exitoso', 
                redirectUrl: 'index.html' 
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'Usuario o contraseña incorrectos' 
            });
        }

    } catch (err) {
        console.error('Error en signin:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});