const express = require('express');
const router = express.Router();
const db = require('./db_cofiguration');

//Endopoint para insertar productos en la base de datos
router.post('/insert-product', async (req, res) => {
    let connection;
    try {
        connection = await db.initialize();
        const { codigo, nombre, descripcion, caducidad} = req.body;
        const tipo = parseInt(req.body.tipo, 10);
        const sucursal = parseInt(req.body.sucursal, 10);
        const cantidad = parseInt(req.body.cantidad, 10);
        
        // Insertar en la tabla producto
        await connection.query(
            `INSERT INTO PRODUCTO(CODIGO, NOMBRE, DESCRIPCION, CADUCIDAD, TIPO_PRODUCTO_ID) 
            VALUES (?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), ?)`,
            {
                codigo,
                nombre,
                descripcion,
                caducidad,
                tipo
            }
        );

        // Insertar en la tabla producto_sucursal
        await connection.query(
            "INSERT INTO PRODUCTO_SUCURSAL(PRODUCTO_CODIGO, SUCURSAL_ID, CANTIDAD) VALUES (?, ?, ?)",
            [
                codigo,
                sucursal,
                cantidad
            ]
        );

        // Commit de la transacción
         await connection.commit();
        res.status(201).redirect('/administration');
    } catch (err) {
        // Rollback de la transacción en caso de error
        if (connection) {
            await connection.rollback();
        }
        res.status(500).send('Error al insertar el producto');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

router.post('/insert-employee', async (req, res) => {
    let connection;
    try {
        connection = await db.initialize();
        const { nombre, apellido_paterno, apellido_materno, correo, lada, telefono} = req.body;
        const rol_de_empleado  = parseInt(req.body.rol_de_empleado, 10);
        const bilingue = parseInt(req.body.bilingue === 'on' ? '1' : '0', 10);
        const sucursal = parseInt(req.body.sucursal, 10);
        
        // Insertar en la tabla producto
        await connection.query(
            "INSERT INTO EMPLEADO(NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, CORREO_EMPLEADO, LADA, TELEFONO, ROL_EMPLEADO_ID, BILINGUE_ID, SUCURSAL_ID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [nombre, apellido_paterno, apellido_materno, correo, lada, telefono, rol_de_empleado, bilingue, sucursal]
        );

        // Commit de la transacción
         await connection.commit();
        res.status(201).redirect('/administration');
    } catch (err) {
        // Rollback de la transacción en caso de error
        if (connection) {
            console.error(err);
            await connection.rollback();
        }
        res.status(500).send('Error al insertar el empleado');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

//Endopoint para eliminar productos en la base de datos
router.post('/delete-product', async (req, res) => {
    let connection;
    try {
        connection = await db.initialize();
        const codigo = req.body.codigo;

        await connection.query(
            "DELETE FROM PRODUCTO WHERE LOWER(CODIGO) = LOWER(?)",
            [codigo]
        );

        // Commit de la transacción
         await connection.commit();
        res.status(201).redirect('/inventory');
    } catch (err) {
        if (connection) {
            console.error(err);
            // Rollback de la transacción en caso de error
            await connection.rollback();
        }
        res.status(500).send('Error al eliminar el producto');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});


//Endopoint para eliminar empleados en la base de datos
router.post('/delete-employee', async (req, res) => {
    let connection;
    try {
        connection = await db.initialize();
        const id = req.body.id;

        // Eliminar en la tabla producto

        await connection.query(
            "DELETE FROM EMPLEADO WHERE LOWER(ID) = LOWER(?)",
            [
                id
            ]
        );

        // Commit de la transacción
         await connection.commit();
        res.status(201).redirect('/staff');
    } catch (err) {
        // Rollback de la transacción en caso de error
        if (connection) {
            await connection.rollback();
        }
        console.error(err);
        res.status(500).send('Error al eliminar el empleado');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

//Endopoint para actualizar empleados en la base de datos
router.post('/update-employee', async (req, res) => {
    let connection;
    try {
        connection = await db.initialize();
        const { id, nombre, apellido_paterno, apellido_materno, correo, lada, telefono} = req.body;
        const rol_de_empleado  = parseInt(req.body.rol_de_empleado, 10);
        const bilingue = parseInt(req.body.bilingue === 'on' ? '1' : '0', 10);
        const sucursal = parseInt(req.body.sucursal, 10);
        
        // Insertar en la tabla producto
        await connection.query(
            "UPDATE EMPLEADO SET NOMBRE = ?, APELLIDO_PATERNO = ?, APELLIDO_MATERNO = ?, CORREO_EMPLEADO = ?, LADA = ?, TELEFONO = ?, ROL_EMPLEADO_ID = ?, BILINGUE_ID = ?, SUCURSAL_ID = ? WHERE ID = ?",
            [
                nombre,
                apellido_paterno,
                apellido_materno,
                correo,
                lada,
                telefono,
                rol_de_empleado,
                bilingue,
                sucursal,
                id
            ]
        );

        // Commit de la transacción
            await connection.commit();
        res.status(201).redirect('/administration');
    } catch (err) {
        // Rollback de la transacción en caso de error
        if (connection) {
            await connection.rollback();
        }
        console.error(err);
        res.status(500).send('Error al actualizar el empleado');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
);


module.exports = router;
