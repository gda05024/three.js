import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/lessons/first-threejs-project">
          01. lessons/first-threejs-project
        </Link>
      </li>
      <li>
        <Link href="/lessons/transform-objects">02. transform-objects</Link>
      </li>
      <li>
        <Link href="/lessons/animation">03. Animation</Link>
      </li>
      <li>
        <Link href="/lessons/camera">04. Camera</Link>
      </li>
      <li>
        <Link href="/lessons/fullscreen-and-resizing">
          05. Fullscreen and resizing
        </Link>
      </li>
      <li>
        <Link href="/lessons/geometry">06. geometry</Link>
      </li>
      <li>
        <Link href="/lessons/debug-ui">07. debug-ui</Link>
      </li>
    </ul>
  );
}
