function slugify(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function getEdificioSlug(edificio) {
    const explicitSlug = edificio?.slug ?? edificio?.planoId ?? edificio?.plano_id;
    const slug = slugify(explicitSlug || edificio?.nombre);

    if (!slug) return null;
    if (slug.startsWith("tornavia")) return "tornavias";
    if (slug.includes("economia") && slug.includes("negocios")) return "eeyn";

    return slug;
}

export function getDetalleAulaPath({ edificio, aula }) {
    const edificioSlug = getEdificioSlug(edificio);
    const aulaRef = aula?.nombre ?? aula?.id;

    if (!edificioSlug || !aulaRef) return null;

    return `/${encodeURIComponent(edificioSlug)}/aulas/${encodeURIComponent(aulaRef)}`;
}
