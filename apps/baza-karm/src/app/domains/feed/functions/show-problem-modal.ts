export function showProblemModal(data: {
  id: string | number;
  brand_name: string;
}) {
  if (!data) {
    return;
  }
  alert(
    $localize`:@@feed.reportProblemMessage:Prześlij napotkany błąd na adres mailowy pomoc@kotopedia.pl z dodatkowymi informacjami o karmie: kod: ${data.id}:feedId:, firma: ${data.brand_name}:brandName:`,
  );
}
