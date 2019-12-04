-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mer. 04 déc. 2019 à 22:08
-- Version du serveur :  5.7.26
-- Version de PHP :  7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `apec`
--

-- --------------------------------------------------------

--
-- Structure de la table `offres`
--

DROP TABLE IF EXISTS `offres`;
CREATE TABLE IF NOT EXISTS `offres` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `salary` int(5) DEFAULT NULL,
  `experience` int(2) NOT NULL,
  `city` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `contract` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `society` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dotNet` tinyint(1) NOT NULL,
  `nodejs` tinyint(1) NOT NULL,
  `my_sql` tinyint(1) NOT NULL,
  `java` tinyint(1) NOT NULL,
  `php` tinyint(1) NOT NULL,
  `js` tinyint(1) NOT NULL,
  `reactjs` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `offres`
--

INSERT INTO `offres` (`id`, `salary`, `experience`, `city`, `date`, `contract`, `society`, `dotNet`, `nodejs`, `my_sql`, `java`, `php`, `js`, `reactjs`) VALUES
(1, 38000, 2, 'Nantes', '2019-11-21', 'CDI', 'SIGMA', 0, 0, 0, 0, 0, 0, 0),
(2, NULL, 3, 'Nantes', '2019-11-21', 'CDI', NULL, 0, 1, 0, 1, 0, 1, 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
