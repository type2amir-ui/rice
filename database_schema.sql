-- Amir Rice Suppliers Database Seed & Catalog Export
-- Generated for PostgreSQL / MySQL / WordPress / MariaDB
-- This file contains all rice varieties, mandi market rates, city hubs, and initial customer reviews.

-- --------------------------------------------------------
-- Table structure for `rice_varieties`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rice_varieties` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `grain_length` varchar(50) NOT NULL,
  `moisture` varchar(50) NOT NULL,
  `broken_percentage` varchar(50) NOT NULL,
  `origin` varchar(100) NOT NULL,
  `price_range_pkr_per_kg` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `primary_uses` text NOT NULL,
  `packaging_options` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rice_varieties` (`id`, `name`, `category`, `grain_length`, `moisture`, `broken_percentage`, `origin`, `price_range_pkr_per_kg`, `description`, `primary_uses`, `packaging_options`) VALUES
('1121-kainat-steam', '1121 Kainat Steam Basmati Rice', 'Steam Basmati', '8.35 mm+', '12.0% Max', '1.0% Max', 'Punjab Mandi Hubs (Hafizabad, Kamoke)', '340 - 370', 'Extra long grain premium aromatic steam rice with high elongation ratio upon cooking. Ideal for luxury catering and exports.', 'Commercial Biryani, High-end Catering, Rice Exporters', '25kg PP Bag, 50kg Jute Bag, Non-Woven Custom Bags'),
('1121-kainat-sella', '1121 Kainat Sella (Parboiled) Rice', 'Sella / Parboiled', '8.30 mm+', '12.5% Max', '1.0% Max', 'Gujranwala & Sheikhupura Belt', '330 - 360', 'Golden and cream parboiled grain with sturdy structure, high yield, and non-sticky cooking perfection for bulk food services.', 'Wedding Daigs, Bulk Institutional Catering, International Freight', '25kg PP Bag, 50kg Master Sacks'),
('super-kernel-basmati', 'Super Kernel Basmati (Old Crop Aged)', 'Traditional Basmati', '7.40 mm+', '11.5% Max', '2.0% Max', 'Chenab River Basin Mandis', '360 - 390', 'Traditional vintage aged basmati renowned for unmatched sweet aroma, delicate slender grains, and royal authentic taste.', 'Five Star Hotels, Authentic Pulao, Gourmet Retail Packaging', '10kg Fabric Bags, 25kg PP Bags'),
('1509-basmati-steam', '1509 Basmati Steam Rice', 'Steam Basmati', '8.40 mm+', '12.5% Max', '2.0% Max', 'Punjab Mills & Mandis', '290 - 320', 'Cost-effective alternative to 1121 with great cooking length, appealing appearance, and soft texture.', 'Budget Hotels, Restaurant Chains, Volume Wholesalers', '25kg, 50kg Standard Woven Bags'),
('b1-broken-basmati', 'B1 Broken Basmati Rice (Super Kernal)', 'Broken Rice', '3.5 - 5.0 mm', '13.0% Max', '25.0% - 35.0%', 'Central Punjab Milling Clusters', '190 - 220', 'High quality clean aromatic broken basmati for everyday household consumption and food production.', 'Kheer, Rice Flour, Congee, Daily Family Cooking', '50kg Bulk Bags'),
('b2-broken-basmati', 'B2 Broken Rice (Industrial Grade)', 'Broken Rice', '2.0 - 3.5 mm', '13.5% Max', '50.0%+', 'Punjab Processing Mills', '160 - 185', 'Cleaned industrial broken rice grains free of stones and dust.', 'Starch Production, Distilleries, Snack Manufacturing, Feed Formulation', '50kg Jute/PP Sacks');

-- --------------------------------------------------------
-- Table structure for `city_distribution_centers`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `city_distribution_centers` (
  `id` varchar(50) NOT NULL,
  `city_name` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `major_wholesale_mandi` varchar(255) NOT NULL,
  `transit_timeline` varchar(100) NOT NULL,
  `phone_contact` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `city_distribution_centers` (`id`, `city_name`, `province`, `major_wholesale_mandi`, `transit_timeline`, `phone_contact`) VALUES
('karachi', 'Karachi', 'Sindh', 'Jodia Bazaar, SITE Area, New Challi, Port Qasim', '24 - 48 Hours Express Freight', '+92 333 8990883'),
('lahore', 'Lahore', 'Punjab', 'Akbari Mandi, Badami Bagh, Shah Alam Market', 'Same Day / 12 Hours Dispatch', '+92 333 8990883'),
('rawalpindi-islamabad', 'Rawalpindi & Islamabad', 'Punjab / Federal', 'Ganj Mandi, I-11/4 Wholesale Grain Market', '12 - 24 Hours via Motorway M-2', '+92 333 8990883'),
('peshawar', 'Peshawar', 'Khyber Pakhtunkhwa', 'Rampura Gate, Peepal Mandi, Ring Road Truck Stand', '24 Hours Transit', '+92 333 8990883'),
('faisalabad', 'Faisalabad', 'Punjab', 'Ghalla Mandi, Jhang Road Wholesale Hub', 'Same Day / 12 Hours', '+92 333 8990883'),
('multan', 'Multan', 'Punjab', 'Chowk Shaheedan, Old Ghalla Mandi', '18 - 24 Hours via M-4', '+92 333 8990883'),
('quetta', 'Quetta', 'Balochistan', 'Liaquat Bazaar, Joint Road Grain Depot', '36 - 48 Hours Secure Freight', '+92 333 8990883');

-- --------------------------------------------------------
-- Table structure for `customer_reviews`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `customer_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(150) NOT NULL,
  `business_type` varchar(150) NOT NULL,
  `city` varchar(100) NOT NULL,
  `variety_purchased` varchar(150) NOT NULL,
  `rating` int(2) NOT NULL DEFAULT 5,
  `review_text` text NOT NULL,
  `verification_status` varchar(50) NOT NULL DEFAULT 'Verified Purchase',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `customer_reviews` (`client_name`, `business_type`, `city`, `variety_purchased`, `rating`, `review_text`, `verification_status`) VALUES
('Haji Tariq Mehmood', 'Wholesale Grain Merchant (Jodia Bazaar)', 'Karachi', '1121 Kainat Sella & Steam', 5, 'Consistently reliable supplier. Dispatched 50 tons of 1121 Kainat Steam with pristine grain length and accurate moisture specifications.', 'Verified Mandi Trader'),
('Malik Usman Farooq', 'Catering & Event Management', 'Lahore', 'Super Kernel Basmati (Aged)', 5, 'Cooking elongation and natural basmati fragrance is unmatched. Zero broken grain complaints across all wedding banquet supplies.', 'Verified Caterer'),
('Sardar Bilal Khan', 'Restaurant Chain Owner', 'Islamabad', '1121 Kainat Steam', 5, 'Transparent brokering and market competitive pricing. Direct dispatch from Hafizabad saved us substantial middlemen costs.', 'Verified Commercial Buyer');
