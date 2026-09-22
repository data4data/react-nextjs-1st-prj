import { ErrorState } from "@/components/error-state";

export default function NotFound() {
  return (
    <ErrorState
      title="Deze pagina bestaat niet"
      description="Misschien is de link verouderd of staat er een typefout in het adres."
    />
  );
}
