/**
 * This file provides a mapping between device models and their Cloudinary image URLs
 */

const deviceImageMap = {
  "iPhone 14 Pro Max": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249153/device_images/device_8defef5d-08e3-49a4-bbb5-d9bbf8d9c6ac.webp",
  "iPhone 14 Pro": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249180/device_images/device_8f72ee61-5b30-44ff-978d-1635c659c46a.webp",
  "iPhone 14 Plus": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249215/device_images/device_8158f219-4ddf-4538-9e2a-a41195507e17.webp",
  "iPhone 14": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249233/device_images/device_3a4ddb43-3c47-491e-923e-f9263934d2a7.webp",
  "iPhone 13 Pro Max": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249669/device_images/device_700d7f75-3914-4545-94a8-3424b16ce86e.webp",
  "iPhone 13 Pro": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249699/device_images/device_7901b727-1b22-4674-ad26-0c04f304f6c0.webp",
  "iPhone 13": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249720/device_images/device_cd1c6fd6-bda1-445a-8b3f-3422102c548a.webp",
  "iPhone 13 mini": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249747/device_images/device_87ecc295-3561-4450-8f39-377ff6e4e2b8.webp",
  "iPhone 12 Pro Max": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250064/device_images/device_d39b438b-65b1-49c4-ad52-262325869c94.webp",
  "iPhone 12 Pro": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250080/device_images/device_492b3ed3-bfd1-42b5-8681-c8a58ae6cd30.webp",
  "iPhone 12": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250099/device_images/device_a682561c-3508-423f-8cba-f3b6e4241ea2.webp",
  "iPhone 12 mini": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250121/device_images/device_5e006620-2b23-4086-87e2-cada97237e0a.webp",
  "iPhone SE (2nd Gen)": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249850/device_images/device_0eff9a30-73e4-4bf2-bc88-d44be93c16a5.webp",
  "iPhone 11 Pro Max": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250138/device_images/device_d0d8ab29-21f1-4193-bd22-32833c511750.webp",
  "iPhone 11 Pro": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250180/device_images/device_e05e7026-6896-4f63-9011-bd50a97abafd.webp",
  "iPhone 11": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250196/device_images/device_4278677c-facd-477f-9cf7-326a1e44f31e.webp",
  "iPhone XS Max": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250209/device_images/device_fd33358f-8368-4ba4-b219-c339009d0ec4.webp",
  "iPhone XS": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250228/device_images/device_13b0476a-556c-4eb8-ac5a-60862baceef7.webp",
  "iPhone XR": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736249830/device_images/device_22f4527f-d208-4c95-82ff-020aeedd552e.webp",
  "iPhone X": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1736250241/device_images/device_e7cacd2d-2fc0-45f7-ba5c-2c3faaaad357.webp",
  "iPhone 8 Plus": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1747216533/iPhone8PlusNoBG_ytvycl.png",
  "iPhone 8": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1747216533/iPhone8NoBG_spsodp.png",
  "iPhone 7 Plus": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1747216531/iPhone7PlusNoBG_biesgp.png",
  "iPhone 7": "https://res.cloudinary.com/dl1kjmaoq/image/upload/v1747216531/iPhone7NoBG_xekb3s.png"
};

/**
 * Get the Cloudinary image URL for a device model
 * @param {string} model - The device model name
 * @returns {string} - The Cloudinary URL or null if not found
 */
export const getDeviceImageUrl = (model) => {
  return deviceImageMap[model] || null;
};

/**
 * Check if a device model has a Cloudinary image
 * @param {string} model - The device model name
 * @returns {boolean} - Whether the device has an image
 */
export const hasDeviceImage = (model) => {
  return !!deviceImageMap[model];
};

export default {
  getDeviceImageUrl,
  hasDeviceImage
};
