import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/lessons/first-threejs-project">
          03. lessons/first-threejs-project
        </Link>
      </li>
      <li>
        <Link href="/lessons/transform-objects">04. transform-objects</Link>
      </li>
      <li>
        <Link href="/lessons/animation">05. Animation</Link>
      </li>
      <li>
        <Link href="/lessons/camera">06. Camera</Link>
      </li>
      <li>
        <Link href="/lessons/fullscreen-and-resizing">
          07. Fullscreen and resizing
        </Link>
      </li>
      <li>
        <Link href="/lessons/vector">08. vector</Link>
      </li>
      <li>
        <Link href="/lessons/geometry">09. geometry</Link>
      </li>
      <li>
        <Link href="/lessons/debug-ui">10. debug-ui</Link>
      </li>
      <li>
        <Link href="/lessons/textures">12. textures</Link>
      </li>
      <li>
        <Link href="/lessons/material">13. material</Link>
      </li>
      <li>
        <Link href="/lessons/3d-text">14. 3d-text</Link>
      </li>
      <li>
        <Link href="/lessons/Light">15. Light</Link>
      </li>
      <li>
        <Link href="/lessons/shadow">16. shadow</Link>
      </li>
      <li>
        <Link href="/lessons/HauntedHouse">17. Haunted House</Link>
      </li>
    </ul>
  );
}
