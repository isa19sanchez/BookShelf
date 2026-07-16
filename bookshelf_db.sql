-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-07-2026 a las 22:53:30
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bookshelf_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `genre` varchar(100) DEFAULT 'General',
  `status` enum('Pendiente','Leyendo','Terminado') DEFAULT 'Pendiente',
  `cover` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `genre`, `status`, `cover`, `description`, `created_at`) VALUES
(1, 'Cien Años De soledad', 'Gabriel García Márquez', 'Realismo Mágico', 'Leyendo', 'https://images.penguinrandomhouse.com/cover/9780525562443', 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.', '2026-07-16 19:36:49'),
(2, 'Dune', 'Frank Herbert', 'Ciencia Ficción', 'Pendiente', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg', 'En el desértico planeta Arrakis, el agua es el bien más preciado y la especia es la sustancia que permite los viajes interestelares.', '2026-07-16 19:36:49'),
(3, 'Sapiens', 'Yuval Noah Harari', 'No ficción', 'Terminado', 'https://images.cdn2.buscalibre.com/fit-in/360x360/b5/1a/b51a9baa4e59e89a3578cb224e1f1d81.jpg', 'Una trepidante narración de la extraordinaria historia de nuestra especie: desde un insignificante simio hasta los dueños del planeta.', '2026-07-16 19:36:49'),
(4, 'Atomic Habits', 'James Clear', 'Autoayuda', 'Leyendo', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOT6fAqTnXIRSYMCljVvuJFLe9p4UUXoRpSd0butOImyFvoRaw4n4ly8gg&s=10', 'La gente suele pensar que cuando quieres cambiar tu vida, necesitas pensar en grande. James Clear nos demuestra que el cambio real proviene de pequeños hábitos.', '2026-07-16 19:36:49'),
(6, 'Antes de diciembre', 'Johana Marcus', 'Romance', 'Terminado', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSG504AXRdPFvKULXM-vInruXRZFFODj2p3VEpXhQLngpeBVaKn-HhoOA&s=10', 'Para Jenna Brown, su primer año en la Universidad suponía alejarse de su familia y sus amigos y enfrentarse al mundo por primera vez en su vida. Su novio le había dejado claras sus intenciones: a partir de ese momento, tenían una relación a distancia y abierta.', '2026-07-16 20:06:16');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
