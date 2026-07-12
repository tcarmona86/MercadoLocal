export const isNonEmptyText = (
  value,
  min = 1,
  max = 5000
) => {
  if (typeof value !== "string") {
    return false;
  }

  const clean = value.trim();

  return clean.length >= min && clean.length <= max;
};

export const isEmail = (value) =>
  typeof value === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/**
 * Exige:
 * - mínimo 8 caracteres;
 * - una letra minúscula;
 * - una letra mayúscula;
 * - al menos un número.
 */
export const isStrongPassword = (value) =>
  typeof value === "string" &&
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);

export const isPositiveNumber = (value) =>
  Number.isFinite(Number(value)) &&
  Number(value) > 0;

export const isNonNegativeInteger = (value) =>
  Number.isInteger(Number(value)) &&
  Number(value) >= 0;

export const isPositiveInteger = (value) =>
  Number.isInteger(Number(value)) &&
  Number(value) > 0;

export const isValidId = (value) =>
  isPositiveInteger(value);

export const cleanText = (value = "") =>
  String(value).trim();

export const isOptionalUrl = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return true;
  }

  try {
    const parsed = new URL(value);

    return (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:"
    );
  } catch {
    return false;
  }
};

export const isRequiredUrl = (value) => {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return false;
  }

  return isOptionalUrl(value.trim());
};
