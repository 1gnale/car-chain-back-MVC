# Validaciones para Clientes Controller

## Archivos Creados/Modificados

### 1. `src/utils/validationsClientes.ts`

Archivo de validaciones para el controlador de clientes con las siguientes validaciones:

#### **create** - Validaciones para crear cliente

- **personaData.nombres**: Requerido, 2-50 caracteres
- **personaData.apellido**: Requerido, 2-50 caracteres
- **personaData.fechaNacimiento**: Formato ISO8601, edad entre 18-100 años
- **personaData.tipoDocumento**: Debe ser uno de: CUIT, CEDULA, DNI, LIBRETA_ENROLE, LIBRETA_CIVICA, PASAPORTE
- **personaData.documento**: Requerido, 7-20 caracteres
- **personaData.domicilio**: Requerido, 5-100 caracteres
- **personaData.correo**: Email válido, máximo 255 caracteres
- **personaData.telefono**: Requerido, 8-20 caracteres, formato válido
- **personaData.sexo**: Debe ser "Masculino" o "Femenino"
- **personaData.localidad_id**: Número entero positivo

#### **getByEmail** - Validaciones para obtener por email

- **email** (param): Email válido y normalizado

#### **update** - Validaciones para actualizar cliente

- **email** (param): Email válido y normalizado
- Todas las validaciones de personaData son opcionales
- Mismas reglas de validación que en create pero con .optional()

#### **getAll** - Validaciones para consultas con filtros

- **page** (query): Opcional, número entero positivo
- **limit** (query): Opcional, número entre 1-100
- **search** (query): Opcional, término de búsqueda de 1-100 caracteres
- **tipoDocumento** (query): Opcional, filtro por tipo de documento
- **localidad_id** (query): Opcional, filtro por localidad

### 2. `src/routes/clienteRoutes.ts`

Actualizado para integrar las validaciones y el middleware de manejo de errores:

```typescript
import { clientesValidation } from "../utils/validationsClientes";
import { handleValidationErrors } from "../middleware/validation";
```

Cada ruta ahora incluye:

1. Validaciones correspondientes
2. Middleware de manejo de errores
3. Controlador

### 3. `src/controllers/clientesController.ts`

Mejorado con las siguientes funcionalidades:

#### **getAllClientes**

- Soporte para paginación (page, limit)
- Filtros por search (nombres, apellido, correo, documento)
- Filtros por tipoDocumento y localidad_id
- Orden por idClient ascendente
- Búsqueda con operadores LIKE para términos parciales

#### **createCliente**

- Verificación de duplicados (documento y correo)
- Retorna cliente completo con información de persona
- Mejor manejo de errores de validación

#### **getClienteByEmail**

- Validación de formato de email
- Búsqueda por email exacto

#### **updateCliente**

- Verificación de duplicados excluyendo la persona actual
- Actualización condicional de campos
- Retorna cliente actualizado completo
- Mejor manejo de errores

## Características Implementadas

### Validaciones Robustas

- Validación de tipos de datos
- Rangos de longitud apropiados
- Formatos específicos (email, fecha, teléfono)
- Enumeraciones para campos específicos
- Validación de edad mínima y máxima

### Manejo de Errores

- Validaciones de duplicados en documento y correo
- Mensajes de error descriptivos en español
- Códigos de respuesta HTTP apropiados
- Validación de existencia de registros

### Flexibilidad

- Validaciones opcionales para updates
- Soporte para múltiples filtros en consultas
- Paginación configurable
- Búsqueda por múltiples campos

### Seguridad

- Sanitización de entrada de datos (trim, normalizeEmail)
- Validación de parámetros de URL
- Prevención de duplicados
- Validación de rangos de edad

### Funcionalidades de Búsqueda

- Búsqueda por texto parcial (nombres, apellido, correo, documento)
- Filtros por tipo de documento
- Filtros por localidad
- Combinación de múltiples filtros

## Uso

Las validaciones se aplican automáticamente en las rutas. Si hay errores de validación, se retornará una respuesta con código 400 y detalles de los errores encontrados.

### Ejemplo de búsqueda con filtros:

```
GET /clientes?page=1&limit=10&search=Juan&tipoDocumento=DNI&localidad_id=1
```

### Ejemplo de respuesta de error de validación:

```json
{
  "status": "error",
  "message": "Errores de validación",
  "errors": [
    {
      "msg": "El correo electrónico debe ser válido",
      "path": "personaData.correo"
    },
    {
      "msg": "La edad debe estar entre 18 y 100 años",
      "path": "personaData.fechaNacimiento"
    }
  ]
}
```

## Mejoras Implementadas

1. **Consistencia**: Todas las validaciones siguen el mismo patrón establecido
2. **Robustez**: Verificación de duplicados y validaciones de negocio
3. **Usabilidad**: Filtros y búsqueda avanzada para getAllClientes
4. **Mantenibilidad**: Código limpio y bien estructurado
5. **Escalabilidad**: Fácil agregar nuevas validaciones y filtros
