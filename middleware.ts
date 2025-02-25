import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const userType = cookieStore.get("type");
  const url = req.nextUrl;

  // Vérifie si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
  if (!token) {
    // Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
    if (url.pathname !== "/") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  // Redirection vers /admin si l'utilisateur est admin et qu'il accède à la page de connexion
  if (token && userType?.value === "admin" && url.pathname === "/") {
    return NextResponse.redirect(new URL("/admin", url));
  }

  // Redirection vers /etudiant si l'utilisateur est etudiant et qu'il accède à la page de connexion
  if (token && userType?.value === "etudiant" && url.pathname === "/") {
    return NextResponse.redirect(new URL("/student", url));
  }

  // Redirection vers /enseignant si l'utilisateur est enseignant et qu'il accède à la page de connexion
  if (token && userType?.value === "enseignant" && url.pathname === "/") {
    return NextResponse.redirect(new URL("/teacher", url));
  }

  // Redirection vers /parent si l'utilisateur est parent et qu'il accède à la page de connexion
  if (token && userType?.value === "parent" && url.pathname === "/") {
    return NextResponse.redirect(new URL("/parent", url));
  }

  // Redirection vers /expert si l'utilisateur est expert et qu'il accède à la page de connexion
  if (token && userType?.value === "expert" && url.pathname === "/") {
    return NextResponse.redirect(new URL("/expert", url));
  }

  // Redirection vers /program_manager si l'utilisateur est parent et qu'il accède à la page de connexion
  if (token && userType?.value === "ResponsableProgramme" && url.pathname === "/") {
    return NextResponse.redirect(new URL("/program-manager", url));
  }

  // Redirection vers /program_manager si l'utilisateur est parent et qu'il accède à la page de connexion
  if (token && userType?.value === "CommiteScientifique" && url.pathname === "/") {
    return NextResponse.redirect(new URL("/scientific-committee", url));
  }

  // Vérification des routes accessibles pour les administrateurs
  if (url.pathname.startsWith("/admin")) {
    if (!token || userType?.value !== "admin") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  // Vérification des routes accessibles pour les étudiants
  if (url.pathname.startsWith("/student")) {
    if (!token || userType?.value !== "etudiant") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  // Vérification des routes accessibles pour les enseignants
  if (url.pathname.startsWith("/teacher")) {
    if (!token || userType?.value !== "enseignant") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  // Vérification des routes accessibles pour les parents
  if (url.pathname.startsWith("/parent")) {
    if (!token || userType?.value !== "parent") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  // Vérification des routes accessibles pour les experts
  if (url.pathname.startsWith("/expert")) {
    if (!token || userType?.value !== "expert") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  // Vérification des routes accessibles pour les responsables de programme
  if (url.pathname.startsWith("/program_manager")) {
    if (!token || userType?.value !== "ResponsableProgramme") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  // Vérification des routes accessibles pour le comité scientifique
  if (url.pathname.startsWith("/scientific_committee")) {
    if (!token || userType?.value !== "CommiteScientifique") {
      return NextResponse.redirect(new URL("/", url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/parent/:path*",
    "/expert/:path*",
    "/program_manager/:path*",
    "/scientific_committee/:path*",
    "/",
  ],
};
