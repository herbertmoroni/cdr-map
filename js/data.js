// CDR (Call Detail Record) data — phone billing records from a telecommunications provider,
// one record per call event. Each record maps to the ERB (Estação Rádio Base / cell tower)
// that handled the call.
//
// Index-based column access avoids encoding issues with accented headers (Duração, Estação, etc.)

const response = await fetch("data/Telefonemas.csv");
const text     = await response.text();

const CALLS = text.trim().split("\n").slice(1).map(line => {
  const v      = line.split(",");
  const [m, d, y] = v[2].trim().split("/");
  return {
    origem:  v[0].trim(),
    destino: v[1].trim(),
    data:    `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y.trim()}`, // DD/MM/YYYY
    hora:    v[3].trim(),
    duracao: Number(v[4].trim()),
    estacao:    v[5].trim(),
    nome:       v[6].trim(),
    bairro:     v[10].trim(),
    logradouro: v[11].trim(),
    lat:     Number(v[12].trim()),
    lon:     Number(v[13].trim()),
    // azimute: direction the antenna sector faces (degrees from North, clockwise)
    // CDR records which sector handled the call, not the caller's exact location
    azimute: Number(v[15].trim()),
    raio:    Number(v[16].trim())
  };
});

export default CALLS;
