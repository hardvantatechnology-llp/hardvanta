// Mock data for the storefront (replaced by DB/Prisma later).
// Theme: electronics & robotics store (robu.in style).

export const categories = [
  { slug: "modules-displays", name: "Electronic Modules and Displays", icon: "MonitorSmartphone" },
  { slug: "diy-kits", name: "DIY and Maker Kits", icon: "Boxes" },
  { slug: "3d-printers", name: "3D Printers and Parts", icon: "Box" },
  { slug: "batteries", name: "Batteries, Power Supply and Accessories", icon: "BatteryCharging" },
  { slug: "motors", name: "Motors | Drivers | Pumps | Actuators", icon: "Cog" },
  { slug: "drones", name: "Drone Parts", icon: "Satellite" },
  { slug: "ev-parts", name: "Electric Vehicle Parts", icon: "Bike" },
  { slug: "components", name: "Electronic Components", icon: "CircuitBoard" },
  { slug: "dev-boards", name: "Development Boards", icon: "Cpu" },
  { slug: "iot-wireless", name: "IoT and Wireless Modules", icon: "Radio" },
  { slug: "mechanical-tools", name: "Mechanical Parts & Workbench Tools", icon: "Wrench" },
  { slug: "sensors", name: "Sensors", icon: "Gauge" },
  { slug: "refurbished", name: "Refurbished and Partial Working", icon: "RotateCcw" },
];

export const products = [
  {
    id: "p1",
    name: "Arduino Uno R3 Compatible Board (with USB Cable)",
    description:
      "ATmega328P microcontroller board with 14 digital I/O pins, 6 analog inputs, USB connection, and power jack. Perfect for beginners and prototyping.",
    price: 649,
    salePrice: 499,
    stock: 120,
    category: "dev-boards",
    brand: "Robu Tech",
    rating: 4.6,
    reviewCount: 312,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&q=80",
  },
  {
    id: "p2",
    name: "Raspberry Pi 4 Model B - 4GB RAM",
    description:
      "Quad-core Cortex-A72 64-bit SoC @ 1.5GHz, 4GB LPDDR4 RAM, dual 4K micro-HDMI, USB 3.0, Gigabit Ethernet.",
    price: 6499,
    salePrice: null,
    stock: 45,
    category: "dev-boards",
    brand: "Raspberry Pi",
    rating: 4.9,
    reviewCount: 528,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1610018556010-6a11691bc905?w=600&q=80",
  },
  {
    id: "p3",
    name: "HC-SR04 Ultrasonic Distance Sensor Module",
    description:
      "Non-contact distance measurement from 2cm to 400cm with 3mm accuracy. Works great with Arduino and Raspberry Pi.",
    price: 149,
    salePrice: 89,
    stock: 500,
    category: "sensors",
    brand: "Robu Tech",
    rating: 4.5,
    reviewCount: 890,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80",
  },
  {
    id: "p4",
    name: "NEMA 17 Stepper Motor (1.8°, 4-wire)",
    description:
      "High-torque bipolar stepper motor, ideal for 3D printers, CNC machines, and robotics projects.",
    price: 799,
    salePrice: 649,
    stock: 80,
    category: "motors",
    brand: "StepDrive",
    rating: 4.7,
    reviewCount: 176,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80",
  },
  {
    id: "p5",
    name: "F450 Quadcopter Frame Kit with Landing Gear",
    description:
      "Durable 450mm wheelbase quadcopter frame with integrated PCB for clean wiring. Great for FPV and aerial photography builds.",
    price: 1299,
    salePrice: null,
    stock: 30,
    category: "drones",
    brand: "SkyBuild",
    rating: 4.4,
    reviewCount: 64,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80",
  },
  {
    id: "p6",
    name: "PLA 3D Printer Filament 1.75mm - 1kg (Blue)",
    description:
      "Premium PLA filament with tight ±0.02mm diameter tolerance. Low warping, smooth prints, vacuum-sealed with desiccant.",
    price: 1099,
    salePrice: 899,
    stock: 200,
    category: "3d-printers",
    brand: "FilaPro",
    rating: 4.8,
    reviewCount: 245,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1631544114578-7be6e0e8c5b4?w=600&q=80",
  },
  {
    id: "p7",
    name: "18650 Li-ion Rechargeable Battery 3.7V 2600mAh",
    description:
      "High-capacity lithium-ion cell for power banks, flashlights, and DIY battery packs. Protected against overcharge.",
    price: 249,
    salePrice: 199,
    stock: 350,
    category: "batteries",
    brand: "PowerCell",
    rating: 4.3,
    reviewCount: 410,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1609592424823-3f3a7b8f0c3e?w=600&q=80",
  },
  {
    id: "p8",
    name: "Digital Multimeter with Backlit LCD",
    description:
      "Auto-ranging multimeter measuring AC/DC voltage, current, resistance, continuity, and diodes. Includes test leads.",
    price: 599,
    salePrice: 449,
    stock: 90,
    category: "mechanical-tools",
    brand: "MeterMax",
    rating: 4.6,
    reviewCount: 198,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80",
  },
  {
    id: "p9",
    name: "ESP32 WiFi + Bluetooth Development Board",
    description:
      "Dual-core 240MHz module with built-in WiFi and Bluetooth, ideal for IoT projects. Breadboard-friendly.",
    price: 449,
    salePrice: 379,
    stock: 160,
    category: "dev-boards",
    brand: "Espressif",
    rating: 4.8,
    reviewCount: 367,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&q=80",
  },
  {
    id: "p10",
    name: "SG90 Micro Servo Motor 9g",
    description:
      "Lightweight 180° servo for robotics, RC, and pan-tilt camera mounts. Operates at 4.8-6V.",
    price: 129,
    salePrice: 99,
    stock: 600,
    category: "motors",
    brand: "Robu Tech",
    rating: 4.5,
    reviewCount: 720,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80",
  },
  {
    id: "p11",
    name: "0.96\" OLED Display Module I2C (128x64)",
    description:
      "Crisp monochrome OLED display, I2C interface, works with Arduino, ESP32, and Raspberry Pi.",
    price: 299,
    salePrice: 229,
    stock: 240,
    category: "sensors",
    brand: "DisplayTech",
    rating: 4.7,
    reviewCount: 285,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&q=80",
  },
  {
    id: "p12",
    name: "Breadboard 830 Points + 65pc Jumper Wires",
    description:
      "Solderless breadboard with power rails plus assorted male-to-male jumper wires. Prototyping essentials kit.",
    price: 199,
    salePrice: 149,
    stock: 420,
    category: "mechanical-tools",
    brand: "Robu Tech",
    rating: 4.6,
    reviewCount: 533,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80",
  },
  {
    id: "p13",
    name: "16x2 LCD Display Module with I2C Backpack",
    description:
      "Classic 16x2 character LCD with soldered I2C adapter — only 4 wires to connect. Blue backlight, high contrast.",
    price: 249,
    salePrice: 179,
    stock: 300,
    category: "modules-displays",
    brand: "DisplayTech",
    rating: 4.6,
    reviewCount: 421,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&q=80",
  },
  {
    id: "p14",
    name: "8-Channel 5V Relay Module Board",
    description:
      "Opto-isolated 8-channel relay board for switching AC/DC loads with microcontrollers. LED status indicators per channel.",
    price: 399,
    salePrice: 329,
    stock: 180,
    category: "modules-displays",
    brand: "Robu Tech",
    rating: 4.5,
    reviewCount: 256,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80",
  },
  {
    id: "p15",
    name: "Line Follower Robot Kit (DIY, Unassembled)",
    description:
      "Complete beginner robotics kit with chassis, IR sensors, motors, and controller. Learn-by-building electronics project.",
    price: 1499,
    salePrice: 1199,
    stock: 60,
    category: "diy-kits",
    brand: "MakerLab",
    rating: 4.7,
    reviewCount: 142,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=600&q=80",
  },
  {
    id: "p16",
    name: "Arduino Starter Kit with 200+ Components",
    description:
      "All-in-one learning kit: Uno board, breadboard, sensors, LEDs, resistors, jumper wires, and a project guide.",
    price: 2499,
    salePrice: 1999,
    stock: 95,
    category: "diy-kits",
    brand: "MakerLab",
    rating: 4.8,
    reviewCount: 388,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&q=80",
  },
  {
    id: "p17",
    name: "36V 10Ah Lithium E-Bike Battery Pack",
    description:
      "High-discharge Li-ion pack with built-in BMS for e-bikes and scooters. Includes charger and XT60 connector.",
    price: 7999,
    salePrice: 6999,
    stock: 25,
    category: "ev-parts",
    brand: "VoltDrive",
    rating: 4.4,
    reviewCount: 53,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1609592424823-3f3a7b8f0c3e?w=600&q=80",
  },
  {
    id: "p18",
    name: "350W Brushless Hub Motor Wheel (E-Scooter)",
    description:
      "8.5-inch BLDC hub motor for electric scooter and e-bike conversions. Quiet, efficient, and durable.",
    price: 4499,
    salePrice: null,
    stock: 18,
    category: "ev-parts",
    brand: "VoltDrive",
    rating: 4.5,
    reviewCount: 37,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80",
  },
  {
    id: "p19",
    name: "1/4W Carbon Film Resistor Assorted Kit (600pcs)",
    description:
      "30 common values from 10Ω to 1MΩ, neatly organized. Essential bench stock for any electronics project.",
    price: 199,
    salePrice: 149,
    stock: 500,
    category: "components",
    brand: "Robu Tech",
    rating: 4.7,
    reviewCount: 612,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80",
  },
  {
    id: "p20",
    name: "Electrolytic Capacitor Assortment Box (120pcs)",
    description:
      "Assorted 0.1µF–1000µF capacitors across 24 values in a labeled storage box. 16V–50V rated.",
    price: 299,
    salePrice: 239,
    stock: 280,
    category: "components",
    brand: "Robu Tech",
    rating: 4.6,
    reviewCount: 318,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=600&q=80",
  },
  {
    id: "p21",
    name: "NRF24L01+ 2.4GHz Wireless Transceiver Module",
    description:
      "Low-power 2.4GHz RF module for wireless communication between microcontrollers. Up to 100m range.",
    price: 149,
    salePrice: 109,
    stock: 340,
    category: "iot-wireless",
    brand: "Espressif",
    rating: 4.5,
    reviewCount: 274,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&q=80",
  },
  {
    id: "p22",
    name: "SIM800L GSM/GPRS Module with Antenna",
    description:
      "Quad-band GSM module for SMS, calls, and GPRS data in IoT projects. Micro-SIM slot and onboard antenna.",
    price: 549,
    salePrice: 449,
    stock: 120,
    category: "iot-wireless",
    brand: "SimCom",
    rating: 4.3,
    reviewCount: 168,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
  },
  {
    id: "p23",
    name: "DHT22 Temperature & Humidity Sensor (Refurbished)",
    description:
      "Tested refurbished DHT22 sensor — fully functional, minor cosmetic marks. Same accuracy at a lower price.",
    price: 299,
    salePrice: 179,
    stock: 40,
    category: "refurbished",
    brand: "Robu Tech",
    rating: 4.2,
    reviewCount: 64,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80",
  },
  {
    id: "p24",
    name: "Raspberry Pi 3 Model B (Refurbished, Tested)",
    description:
      "Inspected and verified working Raspberry Pi 3B. Light handling marks, full warranty. Great value for projects.",
    price: 3499,
    salePrice: 2799,
    stock: 22,
    category: "refurbished",
    brand: "Raspberry Pi",
    rating: 4.4,
    reviewCount: 91,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1610018556010-6a11691bc905?w=600&q=80",
  },
];

export function getFeatured() {
  return products.filter((p) => p.featured);
}

export function getByCategory(slug) {
  return products.filter((p) => p.category === slug);
}

export function getProduct(id) {
  return products.find((p) => p.id === id);
}
