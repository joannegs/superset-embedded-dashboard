import os

import pandas as pd
from sqlalchemy import create_engine

OWID_INDICATORS = {
    "rnd_spending_pct_gdp": (
        "https://ourworldindata.org/grapher/research-spending-gdp.csv"
        "?v=1&csvType=full&useColumnShortNames=true"
    ),
    "researchers_per_million": (
        "https://ourworldindata.org/grapher/researchers-in-rd-per-million-people.csv"
        "?v=1&csvType=full&useColumnShortNames=true"
    ),
    "patent_applications_per_million": (
        "https://ourworldindata.org/grapher/patent-applications-per-million.csv"
        "?v=1&csvType=full&useColumnShortNames=true"
    ),
    "scientific_publications_per_million": (
        "https://ourworldindata.org/grapher/scientific-publications-per-million.csv"
        "?v=1&csvType=full&useColumnShortNames=true"
    ),
}

SOURCE_VALUE_COLUMN = {
    "rnd_spending_pct_gdp": "gb_xpd_rsdv_gd_zs",
    "researchers_per_million": "sp_pop_scie_rd_p6",
    "patent_applications_per_million": "patents_per_million_people",
    "scientific_publications_per_million": "articles_per_million_people",
}


def load_indicator(name: str, url: str) -> pd.DataFrame:
    df = pd.read_csv(url)
    df = df.rename(
        columns={
            "entity": "country",
            "code": "iso_code",
            SOURCE_VALUE_COLUMN[name]: name,
        }
    )
    return df[["country", "iso_code", "year", name]]


def build_dataset() -> pd.DataFrame:
    merged: pd.DataFrame | None = None
    for name, url in OWID_INDICATORS.items():
        print(f"Baixando {name}...")
        indicator_df = load_indicator(name, url)
        merged = (
            indicator_df
            if merged is None
            else merged.merge(indicator_df, on=["country", "iso_code", "year"], how="outer")
        )
    assert merged is not None
    return merged.sort_values(["country", "year"]).reset_index(drop=True)


def main() -> None:
    postgres_user = os.environ["POSTGRES_USER"]
    postgres_password = os.environ["POSTGRES_PASSWORD"]
    postgres_host = os.environ.get("POSTGRES_HOST", "postgres")
    owid_db_name = os.environ.get("OWID_DB_NAME", "owid_data")

    engine = create_engine(
        f"postgresql+psycopg2://{postgres_user}:{postgres_password}"
        f"@{postgres_host}:5432/{owid_db_name}"
    )

    dataset = build_dataset()
    dataset.to_sql("rnd_indicators", engine, if_exists="replace", index=False)
    print(f"OK: {len(dataset)} linhas carregadas em rnd_indicators ({owid_db_name}).")


if __name__ == "__main__":
    main()
