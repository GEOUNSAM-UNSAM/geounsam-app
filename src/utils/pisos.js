export const PISOS_LABELS = {
    pb: "Planta baja",
    p1: "Piso 1",
    s1: "Subsuelo",
};

export function getPisoLabel(slug) {
    return PISOS_LABELS[slug] ?? null;
}
