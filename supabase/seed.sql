-- World Cup Legends Seed Data
-- Run this after schema.sql to populate initial data

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO products (name, slug, price, original_price, description, category, subcategory, images, sizes, colors, in_stock, stock_quantity, featured, rating, review_count, tags, team) VALUES

-- Jerseys
('World Legends Cup 2026 Official Jersey', 'wlc-2026-official-jersey', 129.99, 149.99, 'The official World Legends Cup 2026 jersey. Premium quality fabric with moisture-wicking technology. Features the iconic WLC crest and gold detailing.', 'Jerseys', NULL, ARRAY['/products/jersey-home.jpg'], ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Black/Gold", "hex": "#D4AF37"}, {"name": "White/Gold", "hex": "#FFFFFF"}]'::jsonb, true, 100, true, 4.9, 245, ARRAY['official', 'jersey', 'new arrival'], NULL),

('Brazil Legends Retro Jersey', 'brazil-legends-retro-jersey', 99.99, NULL, 'Celebrate the Seleção legends with this retro-inspired jersey. Features the classic yellow with green trim design worn by Pelé, Ronaldo, and Ronaldinho.', 'Jerseys', 'Retro', ARRAY['/products/brazil-retro.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Yellow/Green", "hex": "#FFDF00"}]'::jsonb, true, 75, true, 4.8, 189, ARRAY['brazil', 'retro', 'legends'], 'Brazil'),

('Argentina Legends Retro Jersey', 'argentina-legends-retro-jersey', 99.99, NULL, 'Honor the Albiceleste legends with this iconic striped design. The jersey worn by Maradona and Messi on their path to World Cup glory.', 'Jerseys', 'Retro', ARRAY['/products/argentina-retro.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Sky Blue/White", "hex": "#75AADB"}]'::jsonb, true, 80, true, 4.9, 312, ARRAY['argentina', 'retro', 'legends'], 'Argentina'),

('Germany Legends Retro Jersey', 'germany-legends-retro-jersey', 99.99, NULL, 'The classic Die Mannschaft design celebrating German football excellence. Worn by Beckenbauer, Müller, and the legends of German football.', 'Jerseys', 'Retro', ARRAY['/products/germany-retro.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "White/Black", "hex": "#FFFFFF"}]'::jsonb, true, 60, false, 4.7, 145, ARRAY['germany', 'retro', 'legends'], 'Germany'),

('Italy Legends Retro Jersey', 'italy-legends-retro-jersey', 99.99, NULL, 'The iconic Azzurri blue. A tribute to Italian football mastery from Baggio to Buffon.', 'Jerseys', 'Retro', ARRAY['/products/italy-retro.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Azzurri Blue", "hex": "#0066B2"}]'::jsonb, true, 55, false, 4.8, 167, ARRAY['italy', 'retro', 'legends'], 'Italy'),

-- Outerwear
('WLC Premium Training Jacket', 'wlc-premium-training-jacket', 149.99, NULL, 'Premium training jacket with water-resistant exterior and thermal lining. Perfect for match days and training sessions.', 'Outerwear', NULL, ARRAY['/products/training-jacket.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Black", "hex": "#0A0A0A"}, {"name": "Navy", "hex": "#1A1A2E"}]'::jsonb, true, 45, false, 4.7, 98, ARRAY['jacket', 'training', 'premium'], NULL),

('Legends Windbreaker', 'legends-windbreaker', 89.99, NULL, 'Lightweight windbreaker with WLC branding. Water-resistant and packable for any weather.', 'Outerwear', NULL, ARRAY['/products/windbreaker.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Black", "hex": "#0A0A0A"}, {"name": "Gold", "hex": "#D4AF37"}]'::jsonb, true, 50, false, 4.6, 67, ARRAY['windbreaker', 'lightweight'], NULL),

-- T-Shirts
('Pelé #10 Signature Collection Tee', 'pele-signature-tee', 49.99, NULL, 'Premium cotton tee celebrating the King of Football. Features Pelé''s signature and iconic #10.', 'T-Shirts', NULL, ARRAY['/products/pele-tee.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Black", "hex": "#0A0A0A"}, {"name": "White", "hex": "#FFFFFF"}]'::jsonb, true, 120, true, 4.9, 203, ARRAY['pele', 'brazil', 'legend'], 'Brazil'),

('Maradona Legend Tee', 'maradona-legend-tee', 49.99, NULL, 'Tribute to Diego Armando Maradona. The Hand of God. El Pibe de Oro.', 'T-Shirts', NULL, ARRAY['/products/maradona-tee.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Navy", "hex": "#1A1A2E"}, {"name": "Sky Blue", "hex": "#75AADB"}]'::jsonb, true, 100, true, 4.9, 287, ARRAY['maradona', 'argentina', 'legend'], 'Argentina'),

('WLC Classic Logo Tee', 'wlc-classic-logo-tee', 39.99, NULL, 'Classic WLC logo t-shirt. 100% organic cotton with premium print.', 'T-Shirts', NULL, ARRAY['/products/logo-tee.jpg'], ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Black", "hex": "#0A0A0A"}, {"name": "White", "hex": "#FFFFFF"}, {"name": "Gold", "hex": "#D4AF37"}]'::jsonb, true, 200, false, 4.5, 156, ARRAY['logo', 'classic', 'basics'], NULL),

-- Shorts
('WLC Training Shorts', 'wlc-training-shorts', 44.99, NULL, 'Lightweight training shorts with moisture-wicking technology. Zippered pockets for secure storage.', 'Shorts', NULL, ARRAY['/products/training-shorts.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Black", "hex": "#0A0A0A"}, {"name": "Navy", "hex": "#1A1A2E"}]'::jsonb, true, 85, false, 4.6, 89, ARRAY['training', 'shorts'], NULL),

-- Accessories
('WLC Official Match Ball', 'wlc-official-match-ball', 159.99, NULL, 'The official match ball of World Legends Cup 2026. FIFA Quality Pro certified.', 'Accessories', 'Equipment', ARRAY['/products/match-ball.jpg'], NULL, NULL, true, 30, true, 4.9, 78, ARRAY['ball', 'official', 'equipment'], NULL),

('Legends Captain Armband', 'legends-captain-armband', 24.99, NULL, 'Official WLC captain armband. Elastic fit with gold embroidered details.', 'Accessories', NULL, ARRAY['/products/armband.jpg'], NULL, '[{"name": "Black/Gold", "hex": "#D4AF37"}]'::jsonb, true, 150, false, 4.8, 234, ARRAY['armband', 'captain', 'accessory'], NULL),

('WLC Premium Scarf', 'wlc-premium-scarf', 29.99, NULL, 'Premium knit scarf with WLC logo. Perfect for match days.', 'Accessories', NULL, ARRAY['/products/scarf.jpg'], NULL, '[{"name": "Black/Gold", "hex": "#D4AF37"}]'::jsonb, true, 200, false, 4.7, 156, ARRAY['scarf', 'winter', 'accessory'], NULL),

('Legends Snapback Cap', 'legends-snapback-cap', 34.99, NULL, 'Premium snapback cap with embroidered WLC logo. Adjustable fit.', 'Accessories', 'Headwear', ARRAY['/products/cap.jpg'], NULL, '[{"name": "Black", "hex": "#0A0A0A"}, {"name": "Navy", "hex": "#1A1A2E"}]'::jsonb, true, 120, false, 4.6, 189, ARRAY['cap', 'hat', 'accessory'], NULL),

-- Collectibles
('WLC 2026 Trophy Replica', 'wlc-2026-trophy-replica', 199.99, NULL, 'Officially licensed 1:4 scale replica of the World Legends Cup trophy. Die-cast metal with gold plating.', 'Collectibles', NULL, ARRAY['/products/trophy-replica.jpg'], NULL, NULL, true, 25, true, 5.0, 45, ARRAY['trophy', 'collectible', 'replica'], NULL),

('Legends Photo Collection Book', 'legends-photo-collection-book', 59.99, NULL, 'Hardcover coffee table book featuring stunning photography of football legends throughout history.', 'Collectibles', 'Books', ARRAY['/products/photo-book.jpg'], NULL, NULL, true, 40, false, 4.8, 67, ARRAY['book', 'photography', 'collectible'], NULL);

-- ============================================
-- LEGENDS
-- ============================================
INSERT INTO legends (name, short_name, country, country_code, position, era, goals, assists, appearances, world_cups, image, team, jersey_number, rating) VALUES
('Pelé', 'Pelé', 'Brazil', 'BR', 'Forward', '1950s-1970s', 77, 35, 92, 3, '/legends/pele.png', 'Brazil', 10, 9.8),
('Diego Maradona', 'Maradona', 'Argentina', 'AR', 'Attacking Midfielder', '1980s-1990s', 34, 25, 91, 1, '/legends/maradona.png', 'Argentina', 10, 9.7),
('Lionel Messi', 'Messi', 'Argentina', 'AR', 'Forward', '2000s-Present', 106, 58, 180, 1, '/legends/messi.png', 'Argentina', 10, 9.9),
('Cristiano Ronaldo', 'Ronaldo', 'Portugal', 'PT', 'Forward', '2000s-Present', 130, 45, 205, 0, '/legends/ronaldo.png', 'Portugal', 7, 9.6),
('Zinedine Zidane', 'Zidane', 'France', 'FR', 'Attacking Midfielder', '1990s-2000s', 31, 25, 108, 1, '/legends/zidane.png', 'France', 10, 9.5),
('Ronaldo Nazário', 'R9', 'Brazil', 'BR', 'Forward', '1990s-2000s', 62, 18, 98, 2, '/legends/r9.png', 'Brazil', 9, 9.6),
('Franz Beckenbauer', 'Beckenbauer', 'Germany', 'DE', 'Defender', '1960s-1980s', 14, 23, 103, 1, '/legends/beckenbauer.png', 'Germany', 5, 9.4),
('Johan Cruyff', 'Cruyff', 'Netherlands', 'NL', 'Forward', '1970s-1980s', 33, 30, 48, 0, '/legends/cruyff.png', 'Netherlands', 14, 9.5),
('Michel Platini', 'Platini', 'France', 'FR', 'Attacking Midfielder', '1980s', 41, 28, 72, 0, '/legends/platini.png', 'France', 10, 9.3),
('Roberto Baggio', 'Baggio', 'Italy', 'IT', 'Forward', '1990s-2000s', 27, 12, 56, 0, '/legends/baggio.png', 'Italy', 10, 9.2),
('Paolo Maldini', 'Maldini', 'Italy', 'IT', 'Defender', '1980s-2000s', 7, 15, 126, 0, '/legends/maldini.png', 'Italy', 3, 9.4),
('Gerd Müller', 'Müller', 'Germany', 'DE', 'Forward', '1970s', 68, 12, 62, 1, '/legends/muller.png', 'Germany', 13, 9.3);

-- ============================================
-- TEAMS
-- ============================================
INSERT INTO teams (name, country_code, flag, world_cups, world_cup_years, confederation, rating, color) VALUES
('Brazil', 'BR', '🇧🇷', 5, ARRAY['1958', '1962', '1970', '1994', '2002'], 'CONMEBOL', 9.5, '#FFDF00'),
('Germany', 'DE', '🇩🇪', 4, ARRAY['1954', '1974', '1990', '2014'], 'UEFA', 9.3, '#000000'),
('Argentina', 'AR', '🇦🇷', 3, ARRAY['1978', '1986', '2022'], 'CONMEBOL', 9.4, '#75AADB'),
('France', 'FR', '🇫🇷', 2, ARRAY['1998', '2018'], 'UEFA', 9.2, '#002395'),
('Italy', 'IT', '🇮🇹', 4, ARRAY['1934', '1938', '1982', '2006'], 'UEFA', 9.1, '#0066B2'),
('Netherlands', 'NL', '🇳🇱', 0, ARRAY[]::text[], 'UEFA', 8.8, '#FF6600'),
('Spain', 'ES', '🇪🇸', 1, ARRAY['2010'], 'UEFA', 8.9, '#FF0000'),
('England', 'GB', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 1, ARRAY['1966'], 'UEFA', 8.7, '#FFFFFF');

-- ============================================
-- MATCHES (Example tournament schedule)
-- ============================================
INSERT INTO matches (home_team, away_team, home_flag, away_flag, match_date, match_time, venue, stage, home_score, away_score, is_live) VALUES
('Brazil', 'Germany', '🇧🇷', '🇩🇪', '2026-07-15', '18:00', 'MetLife Stadium, New York', 'Group A', NULL, NULL, false),
('Argentina', 'France', '🇦🇷', '🇫🇷', '2026-07-15', '21:00', 'Rose Bowl, Los Angeles', 'Group A', NULL, NULL, false),
('Italy', 'Netherlands', '🇮🇹', '🇳🇱', '2026-07-16', '18:00', 'AT&T Stadium, Dallas', 'Group B', NULL, NULL, false),
('Spain', 'England', '🇪🇸', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2026-07-16', '21:00', 'SoFi Stadium, Los Angeles', 'Group B', NULL, NULL, false),
('Brazil', 'France', '🇧🇷', '🇫🇷', '2026-07-19', '18:00', 'MetLife Stadium, New York', 'Group A', NULL, NULL, false),
('Argentina', 'Germany', '🇦🇷', '🇩🇪', '2026-07-19', '21:00', 'Rose Bowl, Los Angeles', 'Group A', NULL, NULL, false),
('Brazil', 'Argentina', '🇧🇷', '🇦🇷', '2026-07-28', '20:00', 'MetLife Stadium, New York', 'Final', NULL, NULL, false);

-- ============================================
-- COUPONS
-- ============================================
INSERT INTO coupons (code, type, value, min_order_amount, max_uses, is_active) VALUES
('WELCOME10', 'percentage', 10, 50, 1000, true),
('LEGEND20', 'percentage', 20, 100, 500, true),
('NEWSLETTER10', 'percentage', 10, NULL, NULL, true),
('FREESHIP', 'fixed', 9.99, 75, 200, true);

-- ============================================
-- Note: Run this after creating an admin user
-- To make a user an admin, run:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
-- ============================================
