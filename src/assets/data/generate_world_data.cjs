// Script to generate world-data.json with countries (ISO codes), states, and major cities
// Run: node generate_world_data.cjs

const fs = require('fs');
const path = require('path');

const data = {
  countries: [
    { name: "Afghanistan", alpha2: "AF", alpha3: "AFG", numeric: "004" },
    { name: "Albania", alpha2: "AL", alpha3: "ALB", numeric: "008" },
    { name: "Algeria", alpha2: "DZ", alpha3: "DZA", numeric: "012" },
    { name: "Argentina", alpha2: "AR", alpha3: "ARG", numeric: "032" },
    { name: "Australia", alpha2: "AU", alpha3: "AUS", numeric: "036" },
    { name: "Austria", alpha2: "AT", alpha3: "AUT", numeric: "040" },
    { name: "Belgium", alpha2: "BE", alpha3: "BEL", numeric: "056" },
    { name: "Bolivia", alpha2: "BO", alpha3: "BOL", numeric: "068" },
    { name: "Brazil", alpha2: "BR", alpha3: "BRA", numeric: "076" },
    { name: "Canada", alpha2: "CA", alpha3: "CAN", numeric: "124" },
    { name: "Chile", alpha2: "CL", alpha3: "CHL", numeric: "152" },
    { name: "China", alpha2: "CN", alpha3: "CHN", numeric: "156" },
    { name: "Colombia", alpha2: "CO", alpha3: "COL", numeric: "170" },
    { name: "Costa Rica", alpha2: "CR", alpha3: "CRI", numeric: "188" },
    { name: "Cuba", alpha2: "CU", alpha3: "CUB", numeric: "192" },
    { name: "Czech Republic", alpha2: "CZ", alpha3: "CZE", numeric: "203" },
    { name: "Denmark", alpha2: "DK", alpha3: "DNK", numeric: "208" },
    { name: "Dominican Republic", alpha2: "DO", alpha3: "DOM", numeric: "214" },
    { name: "Ecuador", alpha2: "EC", alpha3: "ECU", numeric: "218" },
    { name: "Egypt", alpha2: "EG", alpha3: "EGY", numeric: "818" },
    { name: "El Salvador", alpha2: "SV", alpha3: "SLV", numeric: "222" },
    { name: "Finland", alpha2: "FI", alpha3: "FIN", numeric: "246" },
    { name: "France", alpha2: "FR", alpha3: "FRA", numeric: "250" },
    { name: "Germany", alpha2: "DE", alpha3: "DEU", numeric: "276" },
    { name: "Greece", alpha2: "GR", alpha3: "GRC", numeric: "300" },
    { name: "Guatemala", alpha2: "GT", alpha3: "GTM", numeric: "320" },
    { name: "Honduras", alpha2: "HN", alpha3: "HND", numeric: "340" },
    { name: "India", alpha2: "IN", alpha3: "IND", numeric: "356" },
    { name: "Indonesia", alpha2: "ID", alpha3: "IDN", numeric: "360" },
    { name: "Ireland", alpha2: "IE", alpha3: "IRL", numeric: "372" },
    { name: "Israel", alpha2: "IL", alpha3: "ISR", numeric: "376" },
    { name: "Italy", alpha2: "IT", alpha3: "ITA", numeric: "380" },
    { name: "Jamaica", alpha2: "JM", alpha3: "JAM", numeric: "388" },
    { name: "Japan", alpha2: "JP", alpha3: "JPN", numeric: "392" },
    { name: "Mexico", alpha2: "MX", alpha3: "MEX", numeric: "484" },
    { name: "Netherlands", alpha2: "NL", alpha3: "NLD", numeric: "528" },
    { name: "New Zealand", alpha2: "NZ", alpha3: "NZL", numeric: "554" },
    { name: "Nicaragua", alpha2: "NI", alpha3: "NIC", numeric: "558" },
    { name: "Nigeria", alpha2: "NG", alpha3: "NGA", numeric: "566" },
    { name: "Norway", alpha2: "NO", alpha3: "NOR", numeric: "578" },
    { name: "Panama", alpha2: "PA", alpha3: "PAN", numeric: "591" },
    { name: "Paraguay", alpha2: "PY", alpha3: "PRY", numeric: "600" },
    { name: "Peru", alpha2: "PE", alpha3: "PER", numeric: "604" },
    { name: "Philippines", alpha2: "PH", alpha3: "PHL", numeric: "608" },
    { name: "Poland", alpha2: "PL", alpha3: "POL", numeric: "616" },
    { name: "Portugal", alpha2: "PT", alpha3: "PRT", numeric: "620" },
    { name: "Puerto Rico", alpha2: "PR", alpha3: "PRI", numeric: "630" },
    { name: "Romania", alpha2: "RO", alpha3: "ROU", numeric: "642" },
    { name: "Russia", alpha2: "RU", alpha3: "RUS", numeric: "643" },
    { name: "South Africa", alpha2: "ZA", alpha3: "ZAF", numeric: "710" },
    { name: "South Korea", alpha2: "KR", alpha3: "KOR", numeric: "410" },
    { name: "Spain", alpha2: "ES", alpha3: "ESP", numeric: "724" },
    { name: "Sweden", alpha2: "SE", alpha3: "SWE", numeric: "752" },
    { name: "Switzerland", alpha2: "CH", alpha3: "CHE", numeric: "756" },
    { name: "Thailand", alpha2: "TH", alpha3: "THA", numeric: "764" },
    { name: "Turkey", alpha2: "TR", alpha3: "TUR", numeric: "792" },
    { name: "Ukraine", alpha2: "UA", alpha3: "UKR", numeric: "804" },
    { name: "United Kingdom", alpha2: "GB", alpha3: "GBR", numeric: "826" },
    { name: "United States", alpha2: "US", alpha3: "USA", numeric: "840" },
    { name: "Uruguay", alpha2: "UY", alpha3: "URY", numeric: "858" },
    { name: "Venezuela", alpha2: "VE", alpha3: "VEN", numeric: "862" }
  ],
  states: [
    // Colombia
    { name: "Amazonas", country_alpha2: "CO" },
    { name: "Antioquia", country_alpha2: "CO" },
    { name: "Arauca", country_alpha2: "CO" },
    { name: "Atlántico", country_alpha2: "CO" },
    { name: "Bogotá D.C.", country_alpha2: "CO" },
    { name: "Bolívar", country_alpha2: "CO" },
    { name: "Boyacá", country_alpha2: "CO" },
    { name: "Caldas", country_alpha2: "CO" },
    { name: "Caquetá", country_alpha2: "CO" },
    { name: "Casanare", country_alpha2: "CO" },
    { name: "Cauca", country_alpha2: "CO" },
    { name: "Cesar", country_alpha2: "CO" },
    { name: "Chocó", country_alpha2: "CO" },
    { name: "Córdoba", country_alpha2: "CO" },
    { name: "Cundinamarca", country_alpha2: "CO" },
    { name: "Guainía", country_alpha2: "CO" },
    { name: "Guaviare", country_alpha2: "CO" },
    { name: "Huila", country_alpha2: "CO" },
    { name: "La Guajira", country_alpha2: "CO" },
    { name: "Magdalena", country_alpha2: "CO" },
    { name: "Meta", country_alpha2: "CO" },
    { name: "Nariño", country_alpha2: "CO" },
    { name: "Norte de Santander", country_alpha2: "CO" },
    { name: "Putumayo", country_alpha2: "CO" },
    { name: "Quindío", country_alpha2: "CO" },
    { name: "Risaralda", country_alpha2: "CO" },
    { name: "San Andrés y Providencia", country_alpha2: "CO" },
    { name: "Santander", country_alpha2: "CO" },
    { name: "Sucre", country_alpha2: "CO" },
    { name: "Tolima", country_alpha2: "CO" },
    { name: "Valle del Cauca", country_alpha2: "CO" },
    { name: "Vaupés", country_alpha2: "CO" },
    { name: "Vichada", country_alpha2: "CO" },
    // United States
    { name: "Alabama", country_alpha2: "US" },
    { name: "Alaska", country_alpha2: "US" },
    { name: "Arizona", country_alpha2: "US" },
    { name: "California", country_alpha2: "US" },
    { name: "Colorado", country_alpha2: "US" },
    { name: "Florida", country_alpha2: "US" },
    { name: "Georgia", country_alpha2: "US" },
    { name: "Illinois", country_alpha2: "US" },
    { name: "New York", country_alpha2: "US" },
    { name: "Texas", country_alpha2: "US" },
    { name: "Washington", country_alpha2: "US" },
    // Mexico
    { name: "Aguascalientes", country_alpha2: "MX" },
    { name: "Chihuahua", country_alpha2: "MX" },
    { name: "Ciudad de México", country_alpha2: "MX" },
    { name: "Guadalajara", country_alpha2: "MX" },
    { name: "Jalisco", country_alpha2: "MX" },
    { name: "Nuevo León", country_alpha2: "MX" },
    { name: "Puebla", country_alpha2: "MX" },
    { name: "Quintana Roo", country_alpha2: "MX" },
    // Argentina
    { name: "Buenos Aires", country_alpha2: "AR" },
    { name: "Córdoba", country_alpha2: "AR" },
    { name: "Mendoza", country_alpha2: "AR" },
    { name: "Santa Fe", country_alpha2: "AR" },
    // Brazil
    { name: "Amazonas", country_alpha2: "BR" },
    { name: "Bahia", country_alpha2: "BR" },
    { name: "Minas Gerais", country_alpha2: "BR" },
    { name: "Rio de Janeiro", country_alpha2: "BR" },
    { name: "São Paulo", country_alpha2: "BR" },
    // Spain
    { name: "Andalucía", country_alpha2: "ES" },
    { name: "Cataluña", country_alpha2: "ES" },
    { name: "Comunidad de Madrid", country_alpha2: "ES" },
    { name: "País Vasco", country_alpha2: "ES" },
    { name: "Valencia", country_alpha2: "ES" },
    // Chile
    { name: "Región Metropolitana", country_alpha2: "CL" },
    { name: "Valparaíso", country_alpha2: "CL" },
    { name: "Biobío", country_alpha2: "CL" },
    // Peru
    { name: "Lima", country_alpha2: "PE" },
    { name: "Arequipa", country_alpha2: "PE" },
    { name: "Cusco", country_alpha2: "PE" },
    // Ecuador
    { name: "Guayas", country_alpha2: "EC" },
    { name: "Pichincha", country_alpha2: "EC" },
    { name: "Azuay", country_alpha2: "EC" },
    // Venezuela
    { name: "Distrito Capital", country_alpha2: "VE" },
    { name: "Miranda", country_alpha2: "VE" },
    { name: "Zulia", country_alpha2: "VE" },
  ],
  cities: [
    // Colombia - Antioquia
    { name: "Medellín", country_alpha2: "CO", state: "Antioquia" },
    { name: "Bello", country_alpha2: "CO", state: "Antioquia" },
    { name: "Envigado", country_alpha2: "CO", state: "Antioquia" },
    { name: "Itagüí", country_alpha2: "CO", state: "Antioquia" },
    { name: "Rionegro", country_alpha2: "CO", state: "Antioquia" },
    // Colombia - Bogotá
    { name: "Bogotá", country_alpha2: "CO", state: "Bogotá D.C." },
    // Colombia - Valle del Cauca
    { name: "Cali", country_alpha2: "CO", state: "Valle del Cauca" },
    { name: "Palmira", country_alpha2: "CO", state: "Valle del Cauca" },
    { name: "Buenaventura", country_alpha2: "CO", state: "Valle del Cauca" },
    // Colombia - Atlántico
    { name: "Barranquilla", country_alpha2: "CO", state: "Atlántico" },
    { name: "Soledad", country_alpha2: "CO", state: "Atlántico" },
    // Colombia - Santander
    { name: "Bucaramanga", country_alpha2: "CO", state: "Santander" },
    { name: "Floridablanca", country_alpha2: "CO", state: "Santander" },
    // Colombia - Cundinamarca
    { name: "Soacha", country_alpha2: "CO", state: "Cundinamarca" },
    { name: "Zipaquirá", country_alpha2: "CO", state: "Cundinamarca" },
    // Colombia - Bolívar
    { name: "Cartagena", country_alpha2: "CO", state: "Bolívar" },
    // Colombia - Norte de Santander
    { name: "Cúcuta", country_alpha2: "CO", state: "Norte de Santander" },
    // Colombia - Risaralda
    { name: "Pereira", country_alpha2: "CO", state: "Risaralda" },
    // Colombia - Caldas
    { name: "Manizales", country_alpha2: "CO", state: "Caldas" },
    // Colombia - Tolima
    { name: "Ibagué", country_alpha2: "CO", state: "Tolima" },
    // Colombia - Meta
    { name: "Villavicencio", country_alpha2: "CO", state: "Meta" },
    // Colombia - Huila
    { name: "Neiva", country_alpha2: "CO", state: "Huila" },
    // Colombia - Quindío
    { name: "Armenia", country_alpha2: "CO", state: "Quindío" },
    // Colombia - Nariño
    { name: "Pasto", country_alpha2: "CO", state: "Nariño" },
    // Colombia - Magdalena
    { name: "Santa Marta", country_alpha2: "CO", state: "Magdalena" },
    // Colombia - Córdoba
    { name: "Montería", country_alpha2: "CO", state: "Córdoba" },
    // Colombia - Cesar
    { name: "Valledupar", country_alpha2: "CO", state: "Cesar" },
    // Colombia - Boyacá
    { name: "Tunja", country_alpha2: "CO", state: "Boyacá" },
    // Colombia - Cauca
    { name: "Popayán", country_alpha2: "CO", state: "Cauca" },
    // US cities
    { name: "New York City", country_alpha2: "US", state: "New York" },
    { name: "Los Angeles", country_alpha2: "US", state: "California" },
    { name: "San Francisco", country_alpha2: "US", state: "California" },
    { name: "Chicago", country_alpha2: "US", state: "Illinois" },
    { name: "Houston", country_alpha2: "US", state: "Texas" },
    { name: "Dallas", country_alpha2: "US", state: "Texas" },
    { name: "Miami", country_alpha2: "US", state: "Florida" },
    { name: "Orlando", country_alpha2: "US", state: "Florida" },
    { name: "Atlanta", country_alpha2: "US", state: "Georgia" },
    { name: "Seattle", country_alpha2: "US", state: "Washington" },
    { name: "Denver", country_alpha2: "US", state: "Colorado" },
    { name: "Phoenix", country_alpha2: "US", state: "Arizona" },
    // Mexico cities
    { name: "Ciudad de México", country_alpha2: "MX", state: "Ciudad de México" },
    { name: "Guadalajara", country_alpha2: "MX", state: "Jalisco" },
    { name: "Monterrey", country_alpha2: "MX", state: "Nuevo León" },
    { name: "Puebla", country_alpha2: "MX", state: "Puebla" },
    { name: "Cancún", country_alpha2: "MX", state: "Quintana Roo" },
    // Argentina cities
    { name: "Buenos Aires", country_alpha2: "AR", state: "Buenos Aires" },
    { name: "Córdoba", country_alpha2: "AR", state: "Córdoba" },
    { name: "Mendoza", country_alpha2: "AR", state: "Mendoza" },
    { name: "Rosario", country_alpha2: "AR", state: "Santa Fe" },
    // Brazil cities
    { name: "São Paulo", country_alpha2: "BR", state: "São Paulo" },
    { name: "Rio de Janeiro", country_alpha2: "BR", state: "Rio de Janeiro" },
    { name: "Salvador", country_alpha2: "BR", state: "Bahia" },
    { name: "Belo Horizonte", country_alpha2: "BR", state: "Minas Gerais" },
    // Spain cities
    { name: "Madrid", country_alpha2: "ES", state: "Comunidad de Madrid" },
    { name: "Barcelona", country_alpha2: "ES", state: "Cataluña" },
    { name: "Sevilla", country_alpha2: "ES", state: "Andalucía" },
    { name: "Valencia", country_alpha2: "ES", state: "Valencia" },
    { name: "Bilbao", country_alpha2: "ES", state: "País Vasco" },
    // Chile cities
    { name: "Santiago", country_alpha2: "CL", state: "Región Metropolitana" },
    { name: "Valparaíso", country_alpha2: "CL", state: "Valparaíso" },
    { name: "Concepción", country_alpha2: "CL", state: "Biobío" },
    // Peru cities
    { name: "Lima", country_alpha2: "PE", state: "Lima" },
    { name: "Arequipa", country_alpha2: "PE", state: "Arequipa" },
    { name: "Cusco", country_alpha2: "PE", state: "Cusco" },
    // Ecuador cities
    { name: "Guayaquil", country_alpha2: "EC", state: "Guayas" },
    { name: "Quito", country_alpha2: "EC", state: "Pichincha" },
    { name: "Cuenca", country_alpha2: "EC", state: "Azuay" },
    // Venezuela cities
    { name: "Caracas", country_alpha2: "VE", state: "Distrito Capital" },
    { name: "Maracaibo", country_alpha2: "VE", state: "Zulia" },
  ]
};

fs.writeFileSync(
  path.join(__dirname, 'world-data.json'),
  JSON.stringify(data, null, 2),
  'utf8'
);
console.log(`Generated world-data.json: ${data.countries.length} countries, ${data.states.length} states, ${data.cities.length} cities`);
