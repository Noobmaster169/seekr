
// Uniqlo: Convert a T-Shirt Size to Uniqlo Standard Size Code
export function toUniqloStandardSize(size) {
  const map = {
    "XXS": "SMA001",
    "XS": "SMA002",
    "S": "SMA003",
    "M": "SMA004",
    "L": "SMA005",
    "XL": "SMA006",
    "XXL": "SMA007",
    "3XL": "SMA008",
    "4XL": "SMA009",
  };

  const normalized = size.toUpperCase().trim();
  return map[normalized] ?? "";
}

// Uniqlo: Convert Uniqlo Standard Size Code to T-Shirt Size
export function UniqloStandardSizetoSize(code) {
  const map = {
    "SMA001": "XXS",
    "SMA002": "XS",
    "SMA003": "S",
    "SMA004": "M",
    "SMA005": "L",
    "SMA006": "XL",
    "SMA007": "XXL",
    "SMA008": "3XL",
    "SMA009": "4XL",
  };

  const normalized = code.toUpperCase().trim();
  return map[normalized] ?? "";
}

// Uniqlo: Convert a Colour Name to Uniqlo Standard Colour Code
// TODO: Implement this function