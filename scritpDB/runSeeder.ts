import SimpleDataSeeder from './exampleDB';

async function main() {
  try {
    console.log('🚀 Iniciando carga de datos de ejemplo...');
    const seeder = new SimpleDataSeeder();
    await seeder.seedAll();
    console.log('✅ Datos de ejemplo cargados exitosamente');
  } catch (error) {
    console.error('❌ Error al cargar datos de ejemplo:', error);
    process.exit(1);
  }
}

main();
