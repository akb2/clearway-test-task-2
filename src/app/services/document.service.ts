import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AssetsImagesPath, AssetsMockPath } from "@app/data/app";
import { AnyToArray, AnyToInt, AnyToString } from "@app/helpers/converters";
import { DocumentItem } from "@app/models/document";
import { catchError, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(
    private readonly httpClient: HttpClient,
    @Inject(AssetsImagesPath)
    private readonly imagesPath: string,
    @Inject(AssetsMockPath)
    private readonly mockPath: string
  ) { }

  getList() {
    return this.httpClient.get(this.mockPath + "documents.json").pipe(
      catchError(e => {
        console.error("Error while a documents loading", e);

        return [];
      }),
      map((responce: any) => AnyToArray(responce?.pages).map(this.dtoToDocumentItem.bind(this))),
    );
  }

  /*
  * Конвертеры
  */

  private dtoToDocumentItem(dto: any): DocumentItem {
    const id = AnyToInt(dto?.number);
    const name = AnyToString(dto?.name);
    const imageUrl = this.imagesPath + AnyToString(dto?.imageUrl);

    return { id, name, imageUrl };
  }
}
