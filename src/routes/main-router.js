const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('./db_cofiguration');

//Pagina principal

router.get('/', async (req, res) => {
    let connection;
    try {
        const search = req.query.search ? `%${req.query.search}%` : '%%';
        connection = await db.initialize();

        const total_items = await connection.query("select count(*) as total_items from PRODUCTO_SUCURSAL");
        const in_stock = await connection.query("select count(*) as in_stock from PRODUCTO_SUCURSAL where CANTIDAD > 0");
        const out_of_stock = await connection.query("select count(*) as out_of_stock from PRODUCTO_SUCURSAL where CANTIDAD = 0");
        const total_staff = await connection.query("select count(*) as total_staff from EMPLEADO");
        const supervisors = await connection.query("select count(*) as supervisors from EMPLEADO where ROL_EMPLEADO_ID = 1");
        const line_staff = await connection.query("select count(*) as line_staff from EMPLEADO where ROL_EMPLEADO_ID = 2");
        const drivers = await connection.query("select count(*) as drivers from EMPLEADO where ROL_EMPLEADO_ID = 3");
        const coffeemakers = await connection.query("select count(*) as coffeemakers from EMPLEADO where ROL_EMPLEADO_ID = 4");
        const total_branches = await connection.query("select count(*) as total_branches from SUCURSAL");
        const cdmx_branches = await connection.query("select count(ESTADO_ID) as CDMX_branches from SUCURSAL join DIRECCION on (SUCURSAL.DIRECCION_ID = DIRECCION.ID) where ESTADO_ID = 1");
        const veracruz_branches = await connection.query("select count(ESTADO_ID) as veracruz_branches from SUCURSAL join DIRECCION on (SUCURSAL.DIRECCION_ID = DIRECCION.ID) where ESTADO_ID = 2");
        const quintana_roo_branches = await connection.query("select count(ESTADO_ID) as quintana_roo_branches from SUCURSAL join DIRECCION on (SUCURSAL.DIRECCION_ID = DIRECCION.ID) where ESTADO_ID = 5");

        const branches_basic_info = await connection.query(`
            SELECT 
                ESTADO.ESTADO AS state,
                DIRECCION.MUNICIPIO AS branch, 
                CONCAT(DIRECCION.CALLE, ' ', DIRECCION.NO_EXT, ' ', DIRECCION.COLONIA, ' ', DIRECCION.CP) AS address, 
                CONCAT(EMPLEADO.NOMBRE, ' ', EMPLEADO.APELLIDO_PATERNO) AS manager,
                CONCAT(SUCURSAL.LADA, ' ', SUCURSAL.TELEFONO) AS telephone
            FROM EMPLEADO
            JOIN SUCURSAL ON (EMPLEADO.SUCURSAL_ID = SUCURSAL.ID)
            JOIN DIRECCION ON (SUCURSAL.DIRECCION_ID = DIRECCION.ID)
            JOIN ESTADO ON (DIRECCION.ESTADO_ID = ESTADO.ID)
            WHERE ROL_EMPLEADO_ID = 1 AND lower(DIRECCION.MUNICIPIO) LIKE lower(?)
            ORDER BY SUCURSAL_ID`, [search]
        );

        res.render('index', {
            title: 'Dashboard',
            total_items: total_items[0].total_items,
            in_stock: in_stock[0].in_stock,
            out_of_stock: out_of_stock[0].out_of_stock,
            total_staff: total_staff[0].total_staff,
            supervisors: supervisors[0].supervisors,
            line_staff: line_staff[0].line_staff,
            drivers: drivers[0].drivers,
            coffeemakers: coffeemakers[0].coffeemakers,
            total_branches: total_branches[0].total_branches,
            CDMX_branches: cdmx_branches[0].CDMX_branches,
            veracruz_branches: veracruz_branches[0].veracruz_branches,
            quintana_roo_branches: quintana_roo_branches[0].quintana_roo_branches,
            branches_basic_info: branches_basic_info.map(row => ({
                state: row.state,
                branch: row.branch,
                address: row.address,
                manager: row.manager,
                telephone: row.telephone
            }))
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
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

//Pagina de productos

router.get('/inventory', async (req, res) => {
    let connection;
    try {
        const search = req.query.search ? `%${req.query.search}%` : '%%';
        connection = await db.initialize();
        
        const inventory = await connection.query(
            `SELECT 
                PRODUCTO.CODIGO, 
                PRODUCTO.DESCRIPCION AS PRODUCTO, 
                DATE_FORMAT(PRODUCTO.CADUCIDAD, '%d/%M/%Y') AS CADUCIDAD,
                CANTIDAD, 
                SUCURSAL_ID 
                FROM PRODUCTO_SUCURSAL
                JOIN PRODUCTO ON (PRODUCTO_SUCURSAL.PRODUCTO_CODIGO = PRODUCTO.CODIGO) 
                where lower(PRODUCTO.DESCRIPCION) like lower(?)
                ORDER BY SUCURSAL_ID `,
                [search]
        );

        res.render('inventory', {
            title: 'Inventory',
            inventory: inventory.map(row => ({
                code: row.CODIGO,
                product: row.PRODUCTO,
                expiration_date: row.CADUCIDAD,
                quantity: row.CANTIDAD,
                branch_id: row.SUCURSAL_ID
            }))
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
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

//Pagina de empleados

router.get('/staff', async (req, res) => {
    let connection;
    try {
        
        const search = req.query.search ? `%${req.query.search}%` : '%%';

        connection = await db.initialize();
        
        const staff = await connection.query(
            `SELECT EMPLEADO.ID AS ID,
                CONCAT(EMPLEADO.NOMBRE, ' ', EMPLEADO.APELLIDO_PATERNO, ' ', EMPLEADO.APELLIDO_MATERNO) AS NAME,
                CONCAT(EMPLEADO.LADA, ' ', EMPLEADO.TELEFONO) AS TELEPHONE,
                ROL AS POSITION,
                DIRECCION.MUNICIPIO AS BRANCH,
                BILINGUE_ID AS BILINGUAL
             FROM EMPLEADO
             JOIN ROL_EMPLEADO ON EMPLEADO.ROL_EMPLEADO_ID = ROL_EMPLEADO.ID
             JOIN SUCURSAL ON EMPLEADO.SUCURSAL_ID = SUCURSAL.ID
             JOIN DIRECCION ON SUCURSAL.DIRECCION_ID = DIRECCION.ID
             WHERE LOWER(CONCAT(EMPLEADO.NOMBRE, ' ', EMPLEADO.APELLIDO_PATERNO, ' ', EMPLEADO.APELLIDO_MATERNO)) LIKE LOWER(?)
             ORDER BY EMPLEADO.ID`,
            [search]
        );

        res.render('staff', {
            title: 'Staff',
            staff: staff.map(row => ({
                id: row.ID,
                name: row.NAME,
                telephone: row.TELEPHONE,
                position: row.POSITION,
                branch: row.BRANCH,
                bilingual: row.BILINGUAL
            }))
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
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

//Pagina de administracion de inventario, sucurales y empleados

router.get('/administration', async (req, res) => {
    let connection;
    try {
        connection = await db.initialize();
        const product_types = await connection.query(
            `select TIPO from TIPO_PRODUCTO`
        );

        const branches = await connection.query(
            `SELECT NOMBRE from SUCURSAL`
        );

        const employees_rol = await connection.query(
            `select ROL from ROL_EMPLEADO`
        );

        const employees_id = await connection.query(
            `select ID from EMPLEADO`
        );

        res.render('administration', {
            title: 'Administration',
            product_types: product_types.map(row => ({
                product_type: row.TIPO
            })),
            branches: branches.map(row => ({
                branch: row.NOMBRE
            })),
            employees_rol: employees_rol.map(row => ({
                employee_rol: row.ROL
            })),
            employees_id: employees_id.map(row => ({
                employee_id: row.ID
            }))
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
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

module.exports = router;
