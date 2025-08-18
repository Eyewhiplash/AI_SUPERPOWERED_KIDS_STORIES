"""init schema and seeds

Revision ID: 12b5f313a6d8
Revises: 
Create Date: 2025-08-18 12:20:39.503400

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '12b5f313a6d8'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: create tables and seed universal stories."""
    op.execute(
        sa.text(
            """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(128) NOT NULL,
                story_age INTEGER DEFAULT 5,
                story_complexity VARCHAR(20) DEFAULT 'medium'
            );
            """
        )
    )

    op.execute(
        sa.text(
            """
            CREATE TABLE IF NOT EXISTS stories (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(200) NOT NULL,
                content TEXT NOT NULL,
                story_type VARCHAR(50) DEFAULT 'custom',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
            """
        )
    )

    op.execute(
        sa.text(
            """
            CREATE TABLE IF NOT EXISTS story_images (
                id SERIAL PRIMARY KEY,
                story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
                image_index INTEGER DEFAULT 0,
                data_url TEXT NOT NULL,
                prompt TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_story_images_story_id ON story_images(story_id);
            """
        )
    )

    op.execute(
        sa.text(
            """
            CREATE TABLE IF NOT EXISTS story_audio (
                id SERIAL PRIMARY KEY,
                story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
                voice VARCHAR(50) DEFAULT 'alloy',
                audio_bytes BYTEA NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_story_audio_story_id ON story_audio(story_id);
            """
        )
    )

    op.execute(
        sa.text(
            """
            CREATE TABLE IF NOT EXISTS universal_stories (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description VARCHAR(300) NOT NULL,
                icon VARCHAR(10),
                category VARCHAR(100),
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
    )

    # Seed canonical universal stories (upsert-like behavior)
    seeds = [
        (
            'cinderella',
            'Askungen',
            'En klassisk berättelse om vänlighet, tålamod och att våga hoppas.',
            '',
            'Klassiska sagor',
            'Det var en gång en snäll flicka som kallades Askungen...'
        ),
        (
            'little_red',
            'Rödluvan',
            'En berättelse om mod, klokskap och att lyssna på goda råd.',
            '',
            'Klassiska sagor',
            'Rödluvan fick i uppdrag att hälsa på sin mormor...'
        ),
        (
            'three_pigs',
            'De tre små grisarna',
            'En saga om att planera, hjälpas åt och bygga något som håller.',
            '',
            'Klassiska sagor',
            'Tre små grisar bestämde sig för att bygga varsitt hem...'
        ),
        (
            'hansel_gretel',
            'Hans och Greta',
            'En klassisk saga om syskonmod, list och att hitta hem tillsammans.',
            '',
            'Klassiska sagor',
            'Två syskon vandrade i skogen där stigen ibland försvann...'
        ),
        (
            'snow_white',
            'Snövit',
            'En klassisk saga om vänskap, mod och godhetens kraft.',
            '',
            'Klassiska sagor',
            'I ett litet rike växte Snövit upp med ett hjärta...'
        ),
        (
            'sleeping_beauty',
            'Törnrosa',
            'En klassisk berättelse om tid, hopp och att vakna till ett nytt kapitel.',
            '',
            'Klassiska sagor',
            'I ett stilla slott somnade en prinsessa, och hela riket...'
        ),
    ]

    for s in seeds:
        op.execute(
            sa.text(
                """
                INSERT INTO universal_stories (id, title, description, icon, category, content)
                VALUES (:id, :title, :description, :icon, :category, :content)
                ON CONFLICT (id) DO UPDATE SET
                  title=EXCLUDED.title,
                  description=EXCLUDED.description,
                  icon=EXCLUDED.icon,
                  category=EXCLUDED.category,
                  content=EXCLUDED.content
                """
            ).bindparams(id=s[0], title=s[1], description=s[2], icon=s[3], category=s[4], content=s[5])
        )


def downgrade() -> None:
    """Downgrade schema: drop tables."""
    op.execute(sa.text("DROP TABLE IF EXISTS story_audio CASCADE"))
    op.execute(sa.text("DROP TABLE IF EXISTS story_images CASCADE"))
    op.execute(sa.text("DROP TABLE IF EXISTS stories CASCADE"))
    op.execute(sa.text("DROP TABLE IF EXISTS universal_stories CASCADE"))
    op.execute(sa.text("DROP TABLE IF EXISTS users CASCADE"))
