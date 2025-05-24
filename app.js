const express = require('express');
const mongoose =require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost/nueva_db2', {useNewUrlParser: true, useUnifiedTopology: true});

const EmpleadoSchema = new mongoose.Schema({
    _id: Number,
    nombre: String,
    jefeId: {type: Number, default: null},
    departamentoId: {type: Number, default: null}
});

const Empleado = mongoose.model('Empleado', EmpleadoSchema);

app.get('/empleados', async (req, res) => {
    try {
        const empleados = await Empleado.find({}, '_d nombre jefeId departamentoId');
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/empleados', async (req, res) => {
    try {
        const { _id, nombre, jefeId, departamentoId } = req.body;

        //Verificamos que se proporcionen al menos el nombre del empliado
        if (!nombre) {
            return res.status(400).json({ error: 'El nombre del empleado es obligatorio.'});
        }

        const nuevoEmpleado = new Empleado({
            _id,
            nombre,
            jefeId: jefeId || null,
            departamentoId: departamentoId || null
        });

        const resultado = await nuevoEmpleado.save();
        res.json(resultado);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

app.get('/empleados/:id', async (req, res) => {
    try {
        const empleado = await Empleado.findById(req.params.id, '_id nombre jefeId departamentoId');
        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado.'});
        }
        res.json(empleado);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});


app.delete('/empleados/:id', async (req, res) => {
    try {
        const empleadoEliminado = await Empleado.findByIdAndDelete(req.params.id);

        if (!empleadoEliminado) {
            return res.status(404).json({ error: 'Empleado no encontrado'});
        }

        res.json(empleadoEliminado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Exspress en http://localhost:${PORT}`);
});
