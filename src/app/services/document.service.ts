import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AnyToArray, AnyToInt, AnyToString } from "@app/helpers/converters";
import { DocumentItem } from "@app/models/document";
import { catchError, map, Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getList() {
    return this.httpClient.get("/assets/mock/documents.json").pipe(
      catchError(e => {
        console.error("Error while a documents loading", e);

        return [];
      }),
      map((responce: any) => AnyToArray(responce?.pages).map(this.dtoToDocumentItem)),
    );
  }

  /*
  * Конвертеры
  */

  private dtoToDocumentItem(dto: any): DocumentItem {
    const id = AnyToInt(dto?.number);
    const name = AnyToString(dto?.name);
    const imageUrl = "/assets/images/" + AnyToString(dto?.imageUrl);

    return { id, name, imageUrl };
  }
}
